import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import CustomError from '../customTypes/errorType';
const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  const additionalErrors = { validationsErrors: { ...err.validationErrors } };
  res.json({
    message: err.message,
    ...additionalErrors,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
