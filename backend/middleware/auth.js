import { ApiError, asyncHandler } from './error.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Protect routes — requires a valid Bearer JWT.
 * Token can come from Authorization header OR httpOnly cookie.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  let token = '';
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Session expired or invalid token. Please log in again.');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.active) {
    throw new ApiError(401, 'Account no longer available.');
  }

  req.user = user;
  next();
});

/**
 * Restrict to specific roles (e.g. admin only).
 */
export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authenticated.'));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  next();
};

export const adminOnly = authorize('admin');
