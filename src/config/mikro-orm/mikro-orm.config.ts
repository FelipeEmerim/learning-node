import { Options } from '@mikro-orm/core';
import { EntityNotFoundError } from '../../shared/exceptions/entity-not-found.exception';
import env from '../../app.env';
import { mikroOrmEntities } from './mikro-orm.definitions';

export const mikroOrmConfigs: Options = {
  type: 'postgresql',
  entities: mikroOrmEntities,
  dbName: env.DB_DATABASE,
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
  findOneOrFailHandler: () => {
    throw new EntityNotFoundError();
  },
  migrations: {
    tableName: 'migrations',
    emit: 'ts',
    allOrNothing: true,
    dropTables: true,
    safe: false,
    pattern: /^[\w-]+\d+\.ts$/,
    path: './src/migrations',
  },
};
