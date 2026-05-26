import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
    algorithm: 'HS256',
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

export function generateTokenPair(payload: TokenPayload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: JWT_EXPIRY,
  };
}
