import { WinstonModuleOptions, utilities } from 'nest-winston';
import { transports } from 'winston';
import * as winston from 'winston';
import * as apm from 'elastic-apm-node/start';

import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';

import {
  ConsoleTransportOptions,
  FileTransportOptions,
} from 'winston/lib/winston/transports';

import { Client, ClientOptions } from '@elastic/elasticsearch';
import env from '../../app.env';

const winstonTrasports: winston.transport[] = [];

const consoleLoggerOptions: ConsoleTransportOptions = {
  level: env.LOG_CONSOLE_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike(),
  ),
};

winstonTrasports.push(new transports.Console(consoleLoggerOptions));

if (env.LOG_FILE_ACTIVE) {
  const fileLoggerOptions: FileTransportOptions = {
    level: env.LOG_FILE_LEVEL,
    filename: env.LOG_FILE_NAME,
    format: winston.format.json(),
  };

  winstonTrasports.push(new transports.File(fileLoggerOptions));
}

if (env.LOG_ES_ACTIVE) {
  const elasticsearchClientOptions: ClientOptions = {
    auth: {
      apiKey: env.ES_API_KEY,
    },
    node: env.ES_NODE_URL,
  };

  const elasticsearchLoggerOptions: ElasticsearchTransportOptions = {
    apm,
    level: env.LOG_ES_LEVEL,
    client: new Client(elasticsearchClientOptions),
  };

  winstonTrasports.push(new ElasticsearchTransport(elasticsearchLoggerOptions));
}

export const winstonConfig: WinstonModuleOptions = {
  transports: winstonTrasports,
  handleExceptions: true,
};
