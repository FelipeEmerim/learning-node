import * as dotenv from 'dotenv';

dotenv.config();

const env = {
  DB_HOST: process.env.DB_HOST ?? null,
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
  DB_USERNAME: process.env.DB_USERNAME ?? null,
  DB_PASSWORD: process.env.DB_PASSWORD ?? null,
  DB_DATABASE: process.env.DB_DATABASE ?? null,
  HOST: process.env.HOST ?? '0.0.0.0',
  PORT: process.env.PORT ?? 3000,
  SALT: parseInt(process.env.SALT ?? '10', 10),
};

export default env;
