import { Injectable } from '@nestjs/common';
import User from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserSchema } from '../schemas/user.schema';

@Injectable()
export class UserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected usersRepository: UserRepository) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  save(userSchema: UserSchema): Promise<User> {
    return this.usersRepository.save(userSchema);
  }

  async update(id: number, userSchema: UserSchema): Promise<User> {
    const user = await this.findOne(id);
    user.firstName = userSchema.firstName ?? user.firstName;
    user.lastName = userSchema.lastName ?? user.lastName;
    user.isActive = userSchema.isActive ?? user.isActive;
    user.password = userSchema.password ?? user.password;

    return this.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);
  }
}
