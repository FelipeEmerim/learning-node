import { plainToClass } from 'class-transformer';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EntityNotFoundError } from '../../shared/exceptions/entity-not-found.exception';
import { Repository } from '../../shared/abstract/repository.abstract';
import { Cat } from '../entities/cat.entity';

@Injectable()
export class CatRepository implements Repository<Cat> {
  // eslint-disable-next-line no-useless-constructor
  public static KNEX_TOKEN = 'KNEX_CATS_TOKEN';

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject(CatRepository.KNEX_TOKEN)
    protected knex: Knex,
  ) {}

  async find(): Promise<Cat[]> {
    return this.knex<Cat>('cats').select();
  }

  async findOne(id: string): Promise<Cat | null> {
    if (typeof id === 'undefined') {
      return null;
    }

    const cat = await this.knex<Cat>('cats').select().where({ id }).first();

    if (!cat) {
      return null;
    }

    return cat;
  }

  async findOneOrFail(id: string): Promise<Cat> {
    const cat = await this.findOne(id);

    if (!cat) {
      throw new EntityNotFoundError();
    }

    return cat;
  }

  async save(values: object): Promise<Cat> {
    const data = plainToClass(Cat, values);
    const dbCat = await this.findOne(data.id);

    if (!dbCat) {
      const [cat] = await this.knex<Cat>('cats').insert(data).returning('*');
      return cat;
    }

    data.updatedAt = new Date(new Date().toUTCString());
    const [cat] = await this.knex<Cat>('cats')
      .update(data, '*')
      .where({ id: data.id });
    return cat;
  }

  async delete(id: string): Promise<void> {
    await this.knex<Cat>('cats').del().where({ id });
  }
}
