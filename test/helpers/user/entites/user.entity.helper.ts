import User from '../../../../src/user/entities/user.entity';

export class UserEntityHelper {
  static createEntity(): User {
    const user = new User();
    user.id = 1;
    user.firstName = 'Robert';
    user.lastName = 'Garcia';
    user.isActive = true;
    user.password = '123456';

    return user;
  }
}
