import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { plainToClass } from 'class-transformer';
import { EntityNotFoundError } from '../../shared/exceptions/entity-not-found.exception';
import { Repository } from '../../shared/abstract/repository.abstract';
import UserModel from '../models/user.model';
import { User } from '../entities/user.entity';

export class UserRepository implements Repository<User> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectModel(UserModel)
    protected userModel: typeof UserModel,
  ) {}

  async find(): Promise<User[]> {
    const users = await this.userModel.findAll();

    return plainToClass(User, users);
  }

  async findOne(id: number): Promise<User | null> {
    const user = this.userModel.findByPk(id);

    if (user === null) {
      return null;
    }

    return plainToClass(User, user);
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

    const dbUser = await this.userModel.findByPk(user.id);

    if (!dbUser) {
      return plainToClass(User, await user.save());
    }

    return plainToClass(User, await dbUser.save());
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
