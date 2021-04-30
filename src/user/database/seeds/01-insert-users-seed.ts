import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import env from '../../../app.env';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: '96783cdb-c490-4aaa-9894-058949e19e26',
      firstName: 'Romero',
      lastName: 'Britto',
      password: await bcrypt.hash('123456', env.SALT),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'a48e43fb-1762-436c-bd03-19a730a0869b',
      firstName: 'Paulo',
      lastName: 'Souza',
      password: await bcrypt.hash('123456', env.SALT),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'e4e80e06-09ce-47cf-a81b-655ba471bacf',
      firstName: 'Rodrigo',
      lastName: 'Santos',
      password: await bcrypt.hash('123456', env.SALT),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}
