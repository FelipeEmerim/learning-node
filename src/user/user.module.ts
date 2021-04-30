import { Module } from '@nestjs/common';
import { KnexModule } from '../knex/knex.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './providers/user.service';
import { UserRepository } from './repositories/user.repository';
import knexConfigs from './database/knexfile';

@Module({
  imports: [KnexModule.register(UserRepository.KNEX_TOKEN, knexConfigs)],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
