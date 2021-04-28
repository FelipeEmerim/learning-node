import { Knex } from 'knex';
import env from '../../app.env';

/**
 * Migrations and seeds dir are overwritten in knexfile.ts
 * If you need those options import from knexfile.ts
 */
export const knexConfigs: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    port: env.DB_PORT,
    pool: {
      testOnBorrow: true,
    },
  },
  migrations: {
    tableName: 'migrations',
  },
  seeds: {
    timestampFilenamePrefix: false,
  },
};
