import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import env from '../../app.env';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      firstName: 'Romero',
      lastName: 'Britto',
      password: await bcrypt.hash('123456', env.SALT),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      firstName: 'Paulo',
      lastName: 'Souza',
      password: await bcrypt.hash('123456', env.SALT),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      firstName: 'Rodrigo',
      lastName: 'Santos',
      password: await bcrypt.hash('123456', env.SALT),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await knex.raw("select setval('users_id_seq', max(id)) from users");
}
