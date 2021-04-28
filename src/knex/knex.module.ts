import { DynamicModule, Global, Module } from '@nestjs/common';
import { Knex, knex } from 'knex';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

export const KNEX_MODULE = 'KNEX_MODULE';

@Global()
@Module({})
export class KnexModule {
  static forRoot(options: Knex.Config): DynamicModule {
    return {
      module: KnexModule,
      providers: [
        {
          inject: [WINSTON_MODULE_PROVIDER],
          provide: KNEX_MODULE,
          useFactory: (logger: Logger) => {
            logger.info('Creating new knex instance', {
              context: KnexModule.name,
              tags: ['instance', 'knex', 'create'],
            });
            return knex(options);
          },
        },
      ],
      exports: [KNEX_MODULE],
    };
  }
}
