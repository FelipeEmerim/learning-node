import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserUpdateSchema } from '../schemas/user-update.schema';
import { UserSchema } from '../schemas/user.schema';
import env from '../../app.env';

@Injectable()
export class UserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected usersRepository: UserRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async findAll(): Promise<User[]> {
    const users: User[] = await this.usersRepository.find();

    this.logger.log('Retrieved users list', UserService.name);

    return users;
  }

  async create(userSchema: UserSchema): Promise<User> {
    const user = userSchema;

    user.password = await bcrypt.hash(user.password, env.SALT);
    const savedUser = await this.usersRepository.save(user);
    this.logger.log(`User saved: ${savedUser.id}`, UserService.name);

    return savedUser;
  }

  async update(userUpdateSchema: UserUpdateSchema): Promise<User> {
    const user = await this.findOne(userUpdateSchema.id);
    user.firstName = userUpdateSchema.firstName ?? user.firstName;
    user.lastName = userUpdateSchema.lastName ?? user.lastName;
    user.isActive = userUpdateSchema.isActive ?? user.isActive;
    const savedUser = await this.usersRepository.save(user);

    this.logger.log(`User updated: ${savedUser.id}`, UserService.name);

    return savedUser;
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.usersRepository.findOneOrFail(id);

    this.logger.log(`Retrieved user: ${user.id}`, UserService.name);

    return user;
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);

    this.logger.log(`User deleted: ${id}`, UserService.name);
  }
}
