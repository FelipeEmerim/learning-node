import { Knex } from 'knex';
import env from '../../app.env';

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
    directory: 'migrations',
    tableName: 'migrations',
  },
  seeds: {
    directory: 'seeds',
    timestampFilenamePrefix: true,
  },
};
