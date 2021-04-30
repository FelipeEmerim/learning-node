import * as dotenv from 'dotenv';

dotenv.config();

const env = {
  HOST: process.env.HOST ?? '0.0.0.0',
  PORT: process.env.PORT ?? 3000,
  SALT: parseInt(process.env.SALT ?? '10', 10),
  LOG_CONSOLE_LEVEL: process.env.LOG_CONSOLE_LEVEL as string,
  LOG_FILE_ACTIVE: (process.env.LOG_FILE_ACTIVE ?? 'false') === 'true',
  LOG_FILE_LEVEL: process.env.LOG_FILE_LEVEL as string,
  LOG_FILE_NAME: process.env.LOG_FILE_NAME as string,
  LOG_ES_ACTIVE: (process.env.LOG_ES_ACTIVE ?? 'false') === 'true',
  LOG_ES_API_KEY: process.env.LOG_ES_API_KEY as string,
  LOG_ES_NODE_URL: process.env.LOG_ES_NODE_URL as string,
  LOG_ES_LEVEL: process.env.LOG_ES_LEVEL as string,
  LOG_ES_INDEX_PREFIX: process.env.LOG_ES_INDEX_PREFIX ?? 'logs',
  ELASTIC_APM_ACTIVE: (process.env.ELASTIC_APM_ACTIVE ?? 'false') === 'true',
  ELASTIC_APM_SERVER_URL: process.env.ELASTIC_APM_SERVER_URL as string,
  ELASTIC_APM_SERVICE_NAME: process.env.ELASTIC_APM_SERVICE_NAME ?? '',
  ELASTIC_APM_API_KEY: process.env.ELASTIC_APM_API_KEY,
};

export default env;
