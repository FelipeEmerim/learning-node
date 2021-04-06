import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserUpdateSchema } from '../schemas/user-update-schema';
import { UserSchema } from '../schemas/user.schema';
import env from '../../app.env';

@Injectable()
export class UserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected usersRepository: UserRepository) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(userSchema: UserSchema): Promise<User> {
    const user = userSchema;

    user.password = await bcrypt.hash(user.password, env.SALT);
    return this.usersRepository.save(user);
  }

  async update(userUpdateSchema: UserUpdateSchema): Promise<User> {
    const user = await this.findOne(userUpdateSchema.id);
    user.firstName = userUpdateSchema.firstName ?? user.firstName;
    user.lastName = userUpdateSchema.lastName ?? user.lastName;
    user.isActive = userUpdateSchema.isActive ?? user.isActive;

    return this.usersRepository.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);
  }
}
