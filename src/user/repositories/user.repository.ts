import { plainToClass } from 'class-transformer';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EntityNotFoundError } from '../../shared/exceptions/entity-not-found.exception';
import { Repository } from '../../shared/abstract/repository.abstract';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository implements Repository<User> {
  // eslint-disable-next-line no-useless-constructor
  public static KNEX_TOKEN = 'KNEX_USERS_TOKEN';

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject(UserRepository.KNEX_TOKEN)
    protected knex: Knex,
  ) {}

  async find(): Promise<User[]> {
    const users = await this.knex<User>('users').select();

    return users;
  }

  async findOne(id: string): Promise<User | null> {
    if (typeof id === 'undefined') {
      return null;
    }

    const user = await this.knex<User>('users').select().where({ id }).first();

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneOrFail(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new EntityNotFoundError();
    }

    return user;
  }

  async save(values: object): Promise<User> {
    const data = plainToClass(User, values);
    const dbUser = await this.findOne(data.id);

    if (!dbUser) {
      const [user] = await this.knex<User>('users').insert(data).returning('*');
      return user;
    }

    data.updatedAt = new Date(new Date().toUTCString());
    const [user] = await this.knex<User>('users')
      .update(data, '*')
      .where({ id: data.id });
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.knex<User>('users').del().where({ id });
  }
}
