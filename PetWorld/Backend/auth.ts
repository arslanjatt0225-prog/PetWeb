import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'petworld_jwt_default_secret_key_2026_super_secure';

/**
 * Generate cryptographically secure random token (32 bytes hex)
 */
export function generateCryptoToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash raw token with SHA-256 for secure database storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}


export interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: IUser): string {
  const payload: TokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function generateResetToken(email: string): string {
  return jwt.sign({ email, purpose: 'reset-password' }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyResetToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; purpose?: string };
    if (decoded.purpose === 'reset-password') {
      return { email: decoded.email };
    }
    return null;
  } catch {
    return null;
  }
}
