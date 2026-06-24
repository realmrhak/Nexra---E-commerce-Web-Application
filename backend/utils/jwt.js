import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT access token for a user.
 */
export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Verify a JWT token. Throws on invalid.
 */
export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
