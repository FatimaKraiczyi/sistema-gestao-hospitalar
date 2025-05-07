import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });
      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Token ausente ou mal formatado' });
  }
};
