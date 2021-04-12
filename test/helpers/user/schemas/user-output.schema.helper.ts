import { plainToClass } from 'class-transformer';
import { UserOutputSchema } from '../../../../src/user/schemas/user-output.schema';

export class UserOutputSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getPlainUser(): any {
    return {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    };
  }

  static getUserOutputSchema(): UserOutputSchema {
    return plainToClass(
      UserOutputSchema,
      UserOutputSchemaHelper.getPlainUser(),
    );
  }
}
