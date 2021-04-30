import { plainToClass } from 'class-transformer';
import { UserSchema } from '../../../schemas/user.schema';

export class UserSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      firstName: 'Robert',
      lastName: 'Garcia',
      password: '123456',
      isActive: true,
    };
  }

  static createSchema(): UserSchema {
    return plainToClass(UserSchema, UserSchemaHelper.createPlain());
  }
}
