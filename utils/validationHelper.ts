import { Request } from 'express';
import { validationResult } from 'express-validator';
import { HttpException } from '../middlewares/exceptionsHandler';

export const validationHelper = (req: Request) => {
  const validationErrors = validationResult(req).array();

  if (validationErrors.length > 0) {
    throw new HttpException(400, validationErrors);
  }
};
