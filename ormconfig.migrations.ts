import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from './src/app.env';
import { typeOrmEntities } from './src/config/typeorm/typeorm.definitions';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: typeOrmEntities,
  synchronize: false,
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default typeOrmConfig;
