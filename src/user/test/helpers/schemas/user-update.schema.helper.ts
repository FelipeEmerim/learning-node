import { plainToClass } from 'class-transformer';
import { UserUpdateSchema } from '../../../schemas/user-update.schema';

export class UserUpdateSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      firstName: 'Robert',
      lastName: 'Garcia',
      isActive: true,
    };
  }

  static createSchema(): UserUpdateSchema {
    return plainToClass(UserUpdateSchema, UserUpdateSchemaHelper.createPlain());
  }
}
