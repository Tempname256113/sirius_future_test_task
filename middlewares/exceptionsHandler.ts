import { NextFunction, Request, Response } from 'express';

export class HttpException extends Error {
  public readonly status: number;
  public readonly message: any;

  constructor(status: number, message: any) {
    super('null');
    this.status = status;
    this.message = message;
  }
}

export const exceptionHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    statusCode: statusCode,
    message: err.message || 'Внутренняя ошибка сервера'
  });
};
