import Knex from 'knex';

export async function up(knex: Knex) {
  //criar
  return knex.schema.createTable('points', (table) => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
  });
}
export async function down(knex: Knex) {
  //remover
  return knex.schema.dropTable('points');
}
