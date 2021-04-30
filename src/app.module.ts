/* eslint-disable import/order */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston/winston.config';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    CatModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
