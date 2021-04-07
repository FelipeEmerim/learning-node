import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from '../../app.env';
import { typeOrmEntities } from './typeorm.definitions';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DB_HOST as string,
  port: env.DB_PORT,
  username: env.DB_USERNAME as string,
  password: env.DB_PASSWORD as string,
  database: env.DB_DATABASE as string,
  entities: typeOrmEntities,
  synchronize: false,
  migrations: ['migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations',
  },
};
