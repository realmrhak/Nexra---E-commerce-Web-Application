import express from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// ---------- Validators ----------
const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6).max(128),
});

// ---------- Helpers ----------
const setTokenCookie = (res, token) => {
  const days = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7;
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: days * 24 * 60 * 60 * 1000,
  });
};

const issueAuthResponse = (res, user, statusCode = 200) => {
  const token = signToken(user._id.toString());
  setTokenCookie(res, token);
  res.status(statusCode).json({
    success: true,
    message: 'OK',
    token,
    user,
  });
};

// ---------- Routes ----------
// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(422, 'Invalid input', parsed.error.issues);
    }
    const { name, email, password } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, 'Email already registered. Please log in.');

    const user = await User.create({ name, email, password });
    issueAuthResponse(res, user, 201);
  })
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(422, 'Invalid input', parsed.error.issues);
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, 'Invalid email or password.');
    }
    if (!user.active) throw new ApiError(403, 'Account is deactivated.');

    issueAuthResponse(res, user);
  })
);

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json({ success: true, user: req.user });
  })
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = forgotSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Invalid email');

    const user = await User.findOne({ email: parsed.data.email });
    if (!user) {
      // For security reasons do NOT reveal whether the email exists.
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save({ validateBeforeSave: false });

    // In production: email this link via SMTP.
    // For now we just acknowledge; the actual link is delivered out-of-band.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Reset token for ${user.email}: ${resetToken}`);
    }

    res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.',
    });
  })
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = resetSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(422, 'Invalid input', parsed.error.issues);

    const hashedToken = crypto.createHash('sha256').update(parsed.data.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, 'Token is invalid or has expired.');

    user.password = parsed.data.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    issueAuthResponse(res, user);
  })
);

// PATCH /api/auth/update-password  (logged-in user)
router.patch(
  '/update-password',
  protect,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new ApiError(422, 'Current and new password are required.');
    }
    if (newPassword.length < 6) throw new ApiError(422, 'New password too short.');

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      throw new ApiError(401, 'Current password is incorrect.');
    }
    user.password = newPassword;
    await user.save();
    issueAuthResponse(res, user);
  })
);

// GET /api/auth/admin-only-check
router.get('/admin-check', protect, adminOnly, (req, res) => {
  res.json({ success: true, message: 'Admin access granted.', user: req.user });
});

export default router;
