import * as dotenv from 'dotenv';
import { codeBlock } from 'common-tags';

dotenv.config();

const env = {
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_DATABASE: process.env.DB_DATABASE as string,
  HOST: process.env.HOST ?? '0.0.0.0',
  PORT: process.env.PORT ?? 3000,
  SALT: parseInt(process.env.SALT ?? '10', 10),
};

Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(codeBlock`
      Required environment property ${key} not set
    `);
  }
});

export default env;
