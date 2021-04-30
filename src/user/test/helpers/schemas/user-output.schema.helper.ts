import { plainToClass } from 'class-transformer';
import { UserOutputSchema } from '../../../schemas/user-output.schema';

export class UserOutputSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    };
  }

  static createSchema(): UserOutputSchema {
    return plainToClass(UserOutputSchema, UserOutputSchemaHelper.createPlain());
  }
}
