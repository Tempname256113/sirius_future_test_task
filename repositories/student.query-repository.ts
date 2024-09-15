import { db } from '../db/knex.config';

export const studentQueryRepository = {
  async getStudentByEmailOrPhone(dto: { email?: string; phone?: string }) {
    return db('students')
      .select('*')
      .where({ email: dto.email ?? null })
      .orWhere({ phone: dto.phone ?? null })
      .first();
  },

  async getReferrerByReferredUserId(referredUserId: number) {
    return db('referrals')
      .select('*')
      .where({ referred_user_id: referredUserId })
      .first();
  },

  async getReferralsByReferrerId(referrerId: number) {
    const getQuery = () =>
      db('referrals')
        .where({ referrer_id: referrerId })
        .join('students', 'referrals.referrer_id', 'students.id');

    const foundReferralsPromise = getQuery().select(
      'students.fio',
      'students.email'
    );

    const foundReferralsCountPromise = getQuery().count('students.id').first();

    const [foundReferrals, foundReferralsCount] = await Promise.all([
      foundReferralsPromise,
      foundReferralsCountPromise
    ]);

    return {
      referrals: foundReferrals,
      total: Number(foundReferralsCount?.count)
    };
  }
};
