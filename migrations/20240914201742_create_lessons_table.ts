import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table
      .integer('student_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.integer('count').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lessons');
}
