import jwt from 'jsonwebtoken';

export const generateToken = (payload: object, expiresIn: string = '1h') => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};