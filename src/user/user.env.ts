import * as dotenv from 'dotenv';

dotenv.config();

const env = {
  USERS_DB_HOST: process.env.USERS_DB_HOST as string,
  USERS_DB_PORT: parseInt(process.env.USERS_DB_PORT ?? '5432', 10),
  USERS_DB_USERNAME: process.env.USERS_DB_USERNAME as string,
  USERS_DB_PASSWORD: process.env.USERS_DB_PASSWORD as string,
  USERS_DB_DATABASE: process.env.USERS_DB_DATABASE as string,
};

export default env;
