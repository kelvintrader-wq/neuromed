import { Request, Response } from 'express';
import * as authService from '../services/authService.js';

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, fullName, role } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await authService.signup({ email, password, fullName, role });

    res.status(201).json({
      success: true,
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    console.error('[Auth] Signup error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    res.status(401).json({ error: error.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }

    const result = await authService.refreshTokens(refreshToken);

    res.json({
      success: true,
      tokens: result.tokens,
    });
  } catch (error: any) {
    console.error('[Auth] Refresh error:', error);
    res.status(401).json({ error: error.message });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await authService.getUserById(req.user.userId);

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('[Auth] Get profile error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await authService.updateUser(req.user.userId, req.body);

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('[Auth] Update profile error:', error);
    res.status(400).json({ error: error.message });
  }
}
