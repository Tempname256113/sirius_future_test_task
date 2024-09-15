import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  IStudentLoginDto,
  IStudentRegisterDto,
  studentService
} from '../application/student.service';
import { validationHelper } from '../utils/validationHelper';
import { httpStatuses } from '../utils/httpStatuses';
import { validateToken } from '../middlewares/validateToken';
import { studentQueryRepository } from '../repositories/student.query-repository';

export const studentController = Router();

studentController.get(
  '/generate-referral-link',
  validateToken,
  async (req: Request & Record<string, any>, res: Response) => {
    res.send({
      referralLink: studentService.generateReferralLink(req.local.studentId)
    });
  }
);

const loginValidationFields = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 5 }).trim()
];

studentController.post(
  '/register',
  [
    body('fio').isString().isLength({ min: 3 }).trim(),
    body('phone').isMobilePhone('any'),
    body('referralCode').isJWT().optional(),
    ...loginValidationFields
  ],
  async (
    req: Request<{}, {}, IStudentRegisterDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      validationHelper(req);

      await studentService.register(req.body);

      return res.sendStatus(httpStatuses.NO_CONTENT);
    } catch (err) {
      return next(err);
    }
  }
);

studentController.post(
  '/login',
  loginValidationFields,
  async (
    req: Request<{}, {}, IStudentLoginDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      validationHelper(req);

      const token: string = await studentService.login(req.body);

      return res.status(httpStatuses.OK).send({
        token
      });
    } catch (err) {
      return next(err);
    }
  }
);

studentController.get(
  '/payment',
  validateToken,
  async (req: Request & Record<string, any>, res: Response) => {
    await studentService.handlePayment(req.local.studentId);

    res.sendStatus(httpStatuses.NO_CONTENT);
  }
);

studentController.get(
  '/referral-stats/:referrerId',
  async (req: Request, res: Response) => {
    const { referrerId } = req.params;

    return res.send(
      await studentQueryRepository.getReferralsByReferrerId(Number(referrerId))
    );
  }
);
