import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('referrals', (table) => {
    table.increments('id').primary();
    table
      .integer('referrer_id') // id студента который пригласил реферала
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table
      .integer('referred_user_id') // id студента который зарегистрировался по реферальной ссылке
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('referrals');
}
