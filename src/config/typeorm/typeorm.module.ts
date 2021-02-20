import { TypeOrmModule } from '@nestjs/typeorm';
import env from '../../app.env';
import { typeOrmEntities, typeOrmMigrations } from './typeorm.definitions';

export default TypeOrmModule.forRoot({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: typeOrmEntities,
  migrations: typeOrmMigrations,
  synchronize: false,
});
