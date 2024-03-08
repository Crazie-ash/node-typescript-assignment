import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
export const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';
