/* eslint-disable import/order */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston/winston.config';
import { KnexModule } from './knex/knex.module';
import { knexConfigs } from './config/knex/knex.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRoot(knexConfigs),
    UserModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
