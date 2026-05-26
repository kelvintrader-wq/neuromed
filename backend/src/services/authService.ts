import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection.js';
import { generateTokenPair, TokenPayload } from '../utils/jwt.js';

const SALT_ROUNDS = 10;

export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  role?: 'patient' | 'doctor' | 'admin' | 'staff';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function signup(payload: SignUpPayload) {
  const { email, password, fullName, role = 'patient' } = payload;

  // Check if user already exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = uuidv4();

  // Create user
  const result = await query(
    `INSERT INTO users (id, email, password, full_name, role, is_verified, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING id, email, full_name, role`,
    [userId, email, hashedPassword, fullName, role, false]
  );

  const user = result.rows[0];

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user,
    tokens: generateTokenPair(tokenPayload),
  };
}

export async function login(payload: LoginPayload) {
  const { email, password } = payload;

  // Find user
  const result = await query('SELECT id, email, password, full_name, role FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
    tokens: generateTokenPair(tokenPayload),
  };
}

export async function refreshTokens(refreshToken: string) {
  // In a real app, you'd verify the refresh token is stored in DB
  // For now, we just verify it's valid
  const { verifyRefreshToken } = await import('../utils/jwt.js');
  
  const payload = verifyRefreshToken(refreshToken);

  const result = await query('SELECT id, email, role FROM users WHERE id = $1', [payload.userId]);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = result.rows[0];

  const newTokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    tokens: generateTokenPair(newTokenPayload),
  };
}

export async function getUserById(userId: string) {
  const result = await query(
    'SELECT id, email, full_name, phone, role, is_verified, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

export async function updateUser(userId: string, data: Record<string, any>) {
  const allowedFields = ['full_name', 'phone'];
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(data)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(userId);

  const result = await query(
    `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
}
