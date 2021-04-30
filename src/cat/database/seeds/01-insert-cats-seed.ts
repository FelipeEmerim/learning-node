import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('cats').del();

  // Inserts seed entries
  await knex('cats').insert([
    {
      id: '96783cdb-c490-4aaa-9894-058949e19e26',
      name: 'Romero',
      description: 'Britto',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'a48e43fb-1762-436c-bd03-19a730a0869b',
      name: 'Paulo',
      description: 'Souza',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'e4e80e06-09ce-47cf-a81b-655ba471bacf',
      name: 'Rodrigo',
      description: 'Santos',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}
