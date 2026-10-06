import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'harshzynx_jwt_secret_token_secure_signature_2026';

export interface AuthPayload {
  id: string;
  email: string;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized: Authentication required' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
    return;
  }

  const admins = db.get('admins');
  const admin = admins.find((a) => a.id === payload.id && a.email.toLowerCase() === payload.email.toLowerCase());
  if (!admin) {
    res.status(403).json({ success: false, error: 'Forbidden: Admin user not found' });
    return;
  }

  req.user = payload;
  next();
}
