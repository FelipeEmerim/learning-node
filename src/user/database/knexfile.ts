import * as path from 'path';
import { Knex } from 'knex';
import env from '../user.env';

/**
 * Migrations and seeds dir are overwritten in knexfile.ts
 * If you need those options import from knexfile.ts
 */
const knexConfigs: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.USERS_DB_HOST,
    user: env.USERS_DB_USERNAME,
    password: env.USERS_DB_PASSWORD,
    database: env.USERS_DB_DATABASE,
    port: env.USERS_DB_PORT,
    pool: {
      testOnBorrow: true,
    },
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  seeds: {
    timestampFilenamePrefix: false,
    directory: path.join(__dirname, 'seeds'),
  },
};

export default knexConfigs;
