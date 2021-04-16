import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { plainToClass } from 'class-transformer';
import { UserRepository } from '../repositories/user.repository';
import { UserUpdateSchema } from '../schemas/user-update.schema';
import { UserSchema } from '../schemas/user.schema';
import env from '../../app.env';
import { User } from '../entities/user.entity';
import classTransformOptions from '../../config/class-transformer/transformer.config';

@Injectable()
export class UserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected usersRepository: UserRepository,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findAll();

    this.logger.info('Retrieved users list', {
      context: UserService.name,
      tags: ['user', 'list', 'service'],
    });

    return users;
  }

  async create(userSchema: UserSchema): Promise<User> {
    const user = plainToClass(User, userSchema, classTransformOptions);

    user.password = await bcrypt.hash(user.password, env.SALT);
    const savedUser = await this.usersRepository.save(user);
    this.logger.info(`User saved: ${savedUser.id}`, {
      context: UserService.name,
      tags: ['user', 'create'],
    });

    return savedUser;
  }

  async update(userUpdateSchema: UserUpdateSchema): Promise<User> {
    const user = await this.findOne(userUpdateSchema.id);
    user.firstName = userUpdateSchema.firstName ?? user.firstName;
    user.lastName = userUpdateSchema.lastName ?? user.lastName;
    user.isActive = userUpdateSchema.isActive ?? user.isActive;

    const savedUser = await this.usersRepository.save(user);

    this.logger.info(`User updated: ${savedUser.id}`, {
      context: UserService.name,
      tags: ['user', 'update'],
    });

    return savedUser;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneOrFail(id);

    this.logger.info(`Retrieved user: ${user.id}`, {
      context: UserService.name,
      tags: ['user', 'getById'],
    });

    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.delete(user);

    this.logger.info(`User deleted: ${id}`, {
      context: UserService.name,
      tags: ['user', 'delete'],
    });
  }
}
