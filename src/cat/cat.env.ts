import * as dotenv from 'dotenv';

dotenv.config();

const env = {
  CATS_DB_HOST: process.env.CATS_DB_HOST as string,
  CATS_DB_PORT: parseInt(process.env.CATS_DB_PORT ?? '5432', 10),
  CATS_DB_USERNAME: process.env.CATS_DB_USERNAME as string,
  CATS_DB_PASSWORD: process.env.CATS_DB_PASSWORD as string,
  CATS_DB_DATABASE: process.env.CATS_DB_DATABASE as string,
};

export default env;
