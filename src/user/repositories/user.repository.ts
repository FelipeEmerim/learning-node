import { plainToClass } from 'class-transformer';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EntityNotFoundError } from '../../shared/exceptions/entity-not-found.exception';
import { Repository } from '../../shared/abstract/repository.abstract';
import { User } from '../entities/user.entity';
import { KNEX_MODULE } from '../../knex/knex.module';

@Injectable()
export class UserRepository implements Repository<User> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject(KNEX_MODULE)
    protected knex: Knex,
  ) {}

  async find(): Promise<User[]> {
    const users = await this.knex<User>('users').select('*');

    return users;
  }

  async findOne(id: number): Promise<User | null> {
    if (typeof id === 'undefined') {
      return null;
    }

    const user = await this.knex<User>('users')
      .select('*')
      .where({ id })
      .first();

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneOrFail(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new EntityNotFoundError();
    }

    return user;
  }

  async save(values: object): Promise<User> {
    const user = plainToClass(User, values);
    const dbUser = await this.findOne(user.id);

    if (!dbUser) {
      const users = await this.knex<User>('users').insert(user).returning('*');
      return users[0];
    }

    user.updatedAt = new Date(new Date().toUTCString());
    const users = await this.knex<User>('users').update(user, '*');
    return users[0];
  }

  async delete(id: number): Promise<void> {
    await this.knex<User>('users').del().where({ id });
  }
}
