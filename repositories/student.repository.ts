import { IStudentRegisterDto } from '../application/student.service';
import { db } from '../db/knex.config';

export const studentRepository = {
  async register(dto: Omit<IStudentRegisterDto, 'referralCode'>) {
    return db('students')
      .insert({
        fio: dto.fio,
        email: dto.email,
        phone: dto.phone,
        password: dto.password
      })
      .returning('*')
      .then((studentsArr) => studentsArr[0]);
  },

  async saveReferrals(dto: { referrerId: number; referredUserId: number }) {
    await db('referrals').insert({
      referrer_id: dto.referrerId,
      referred_user_id: dto.referredUserId
    });
  },

  async savePayment(dto: { studentId: number; amount: number }) {
    await db('payments').insert({
      student_id: dto.studentId,
      amount: dto.amount
    });
  },

  async saveLessons(dto: { studentId: number; count: number }[]) {
    const mappedDto = dto.map((data) => ({
      student_id: data.studentId,
      count: data.count
    }));

    await db('lessons').insert(mappedDto);
  }
};
