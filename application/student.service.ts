import { HttpException } from '../middlewares/exceptionsHandler';
import { studentQueryRepository } from '../repositories/student.query-repository';
import bcrypt from 'bcrypt';
import { studentRepository } from '../repositories/student.repository';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { httpStatuses } from '../utils/httpStatuses';

export interface IStudentLoginDto {
  email: string;
  password: string;
}

export interface IStudentRegisterDto extends IStudentLoginDto {
  fio: string;
  phone: string;
  referralCode?: string;
}

const jwtSecret = process.env.JWT_SECRET as string;

export const studentService = {
  async register(dto: IStudentRegisterDto): Promise<void> {
    const foundStudentWithSimilarEmailOrPhone =
      await studentQueryRepository.getStudentByEmailOrPhone({
        email: dto.email,
        phone: dto.phone
      });

    if (foundStudentWithSimilarEmailOrPhone) {
      throw new HttpException(
        httpStatuses.BAD_REQUEST,
        'Указанные email или номер телефона заняты. Попробуйте другие'
      );
    }

    dto.password = await bcrypt.hash(dto.password, 10);

    const createdStudent = await studentRepository.register(dto);

    let referrerId: number | null = null;
    if (dto.referralCode) {
      const decoded = jwt.verify(dto.referralCode, jwtSecret) as {
        studentId: number;
      };

      referrerId = decoded.studentId;
    }

    if (referrerId) {
      await studentRepository.saveReferrals({
        referrerId,
        referredUserId: createdStudent.id
      });
    }

    await createdStudent;
  },

  async login(dto: IStudentLoginDto): Promise<string> {
    const foundStudentByEmail =
      await studentQueryRepository.getStudentByEmailOrPhone({
        email: dto.email
      });

    if (!foundStudentByEmail) {
      throw new HttpException(
        httpStatuses.NOT_FOUND,
        'Не найден студент с предоставленным email'
      );
    }

    const passwordIsCorrect: boolean = await bcrypt.compare(
      dto.password,
      foundStudentByEmail.password
    );

    if (!passwordIsCorrect) {
      throw new HttpException(
        httpStatuses.FORBIDDEN,
        'Неверные email или пароль'
      );
    }

    return jwt.sign({ studentId: foundStudentByEmail.id }, jwtSecret);
  },

  generateReferralLink(studentId: number) {
    const referralToken = jwt.sign({ studentId }, jwtSecret);
    return `http://localhost:3001/student/register?referral=${referralToken}`;
  },

  async handlePayment(studentId: number) {
    await studentRepository.savePayment({
      studentId,
      amount: 4
    });

    const foundReferral =
      await studentQueryRepository.getReferrerByReferredUserId(studentId);

    if (!foundReferral) {
      await studentRepository.saveLessons([
        {
          studentId,
          count: 4
        }
      ]);

      return;
    }

    await studentRepository.saveLessons([
      {
        studentId,
        count: 4
      },
      {
        studentId: foundReferral.referrer_id,
        count: 4
      }
    ]);
  }
};
