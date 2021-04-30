import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('cats').del();

  // Inserts seed entries
  await knex('cats').insert([
    {
      id: 1,
      name: 'Romero',
      description: 'Britto',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Paulo',
      description: 'Souza',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Rodrigo',
      description: 'Santos',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await knex.raw("select setval('cats_id_seq', max(id)) from cats");
}
