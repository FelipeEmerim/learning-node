import { User } from '../../../entities/user.entity';

export class UserEntityHelper {
  static createEntity(): User {
    const user = new User();
    user.id = '7ef3c0ba-03d7-49e4-8d83-7b7b6c8eb929';
    user.firstName = 'Robert';
    user.lastName = 'Garcia';
    user.isActive = true;
    user.password = '123456';

    return user;
  }
}
