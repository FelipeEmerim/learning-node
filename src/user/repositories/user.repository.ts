import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { EntityNotFoundError } from '../../shared/exceptions/entity-not-found.exception';
import { Repository } from '../../shared/abstract/repository.abstract';
import User from '../models/user.model';

export class UserRepository implements Repository<User> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectModel(User)
    protected userModel: typeof User,
  ) {}

  async find(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findOneOrFail(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (user === null) {
      throw new EntityNotFoundError();
    }

    return user;
  }

  async save(values: object): Promise<User> {
    const user = this.userModel.build(values);

    const dbUser = await this.findOne(user.id);

    if (!dbUser) {
      return user.save();
    }

    return dbUser.update(user);
  }

  async delete(id: number): Promise<void> {
    this.userModel.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
  }
}
