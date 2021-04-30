import { plainToClass } from 'class-transformer';
import { UserOutputSchema } from '../../../schemas/user-output.schema';

export class UserOutputSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: '7ef3c0ba-03d7-49e4-8d83-7b7b6c8eb929',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    };
  }

  static createSchema(): UserOutputSchema {
    return plainToClass(UserOutputSchema, UserOutputSchemaHelper.createPlain());
  }
}
