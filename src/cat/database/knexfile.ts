import * as path from 'path';
import { Knex } from 'knex';
import env from '../cat.env';

/**
 * Migrations and seeds dir are overwritten in knexfile.ts
 * If you need those options import from knexfile.ts
 */
const knexConfigs: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.CATS_DB_HOST,
    user: env.CATS_DB_USERNAME,
    password: env.CATS_DB_PASSWORD,
    database: env.CATS_DB_DATABASE,
    port: env.CATS_DB_PORT,
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
