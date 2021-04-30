import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cats', (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary();
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.boolean('isActive').defaultTo(true).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('cats');
}
