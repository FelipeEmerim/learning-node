import { Repository, EntityRepository } from '@mikro-orm/core';
import { Repository as RepositoryInterface } from '../../shared/abstract/repository.abstract';
// eslint-disable-next-line import/no-cycle
import { User } from '../entities/user.entity';

@Repository(User)
export class UserRepository
  extends EntityRepository<User>
  implements RepositoryInterface<User> {
  async save(user: User): Promise<User> {
    await this.persist(user).flush();
    return user;
  }

  async delete(user: User): Promise<void> {
    await this.remove(user).flush();
  }
}
