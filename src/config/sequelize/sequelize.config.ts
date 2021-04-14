import { SequelizeModuleOptions } from '@nestjs/sequelize';
import env from '../../app.env';
import { sequelizeModels } from './sequelize.definitions';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: env.DB_HOST as string,
  port: env.DB_PORT,
  username: env.DB_USERNAME as string,
  password: env.DB_PASSWORD as string,
  database: env.DB_DATABASE as string,
  models: sequelizeModels,
  synchronize: false,
  migrations: ['migrations/*{.ts,.js}'],
};
