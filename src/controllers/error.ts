import { Request, Response, NextFunction } from 'express';
export const get404 = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Invalid API Route' });
};
