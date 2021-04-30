import { Module } from '@nestjs/common';
import { KnexModule } from '../knex/knex.module';
import { CatRepository } from './repositories/cat.repository';
import knexConfigs from './database/knexfile';
import { CatService } from './providers/cat.service';
import { CatController } from './controllers/cat.controller';

@Module({
  imports: [KnexModule.register(CatRepository.KNEX_TOKEN, knexConfigs)],
  providers: [CatRepository, CatService],
  controllers: [CatController],
  exports: [CatService],
})
export class CatModule {}
