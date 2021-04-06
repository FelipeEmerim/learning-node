import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from '../../app.env';
import { typeOrmEntities } from './typeorm.definitions';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: typeOrmEntities,
  synchronize: false,
  migrations: ['migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations',
  },
};
