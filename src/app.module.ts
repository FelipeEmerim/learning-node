/* eslint-disable import/order */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import TypeOrmModule from './config/typeorm/typeorm.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
