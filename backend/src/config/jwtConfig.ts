import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'THIS_IS_A_UNIFIED_FALLBACK_SECRET_KEY_12345!',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
}; 