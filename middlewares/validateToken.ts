import { NextFunction, Request, Response } from 'express';
import { httpStatuses } from '../utils/httpStatuses';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const validateToken = (
  req: Request & Record<string, any>,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers?.authorization) {
    return res
      .status(httpStatuses.UNAUTHORIZED)
      .send('Нет заголовка authorization');
  }

  const [bearer, token] = req.headers?.authorization?.split(' ') as string[];

  if (bearer !== 'Bearer') {
    return res
      .status(httpStatuses.UNAUTHORIZED)
      .send('В заголовке authorization необходимо предоставить Bearer токен');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    studentId: number;
  };

  if (!decoded.studentId) {
    return res
      .status(httpStatuses.UNAUTHORIZED)
      .send('Предоставлен не валидный токен');
  }

  req.local = {
    studentId: decoded.studentId
  };

  next();
};
