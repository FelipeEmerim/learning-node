import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CatRepository } from '../repositories/cat.repository';
import { CatUpdateSchema } from '../schemas/cat-update.schema';
import { CatSchema } from '../schemas/cat.schema';
import { Cat } from '../entities/cat.entity';

@Injectable()
export class CatService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected catsRepository: CatRepository,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findAll(): Promise<Cat[]> {
    const cats = await this.catsRepository.find();

    this.logger.info('Retrieved cats list', {
      context: CatService.name,
      tags: ['cats', 'list', 'service'],
    });

    return cats;
  }

  async create(catSchema: CatSchema): Promise<Cat> {
    const cat = catSchema;

    const savedCat = await this.catsRepository.save(cat);
    this.logger.info(`Cat saved: ${savedCat.id}`, {
      context: CatService.name,
      tags: ['cat', 'create'],
    });

    return savedCat;
  }

  async update(catUpdateSchema: CatUpdateSchema): Promise<Cat> {
    const cat = await this.findOne(catUpdateSchema.id);
    cat.name = catUpdateSchema.name ?? cat.name;
    cat.description = catUpdateSchema.description ?? cat.description;
    cat.isActive = catUpdateSchema.isActive ?? cat.isActive;
    const savedCat = await this.catsRepository.save(cat);

    this.logger.info(`Cat updated: ${savedCat.id}`, {
      context: CatService.name,
      tags: ['cat', 'update'],
    });

    return savedCat;
  }

  async findOne(id: string): Promise<Cat> {
    const cat = await this.catsRepository.findOneOrFail(id);

    this.logger.info(`Retrieved cat: ${cat.id}`, {
      context: CatService.name,
      tags: ['cat', 'getById'],
    });

    return cat;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.catsRepository.delete(id);

    this.logger.info(`Cat deleted: ${id}`, {
      context: CatService.name,
      tags: ['cat', 'delete'],
    });
  }
}
