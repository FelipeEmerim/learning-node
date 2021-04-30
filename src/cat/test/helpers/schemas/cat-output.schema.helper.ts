import { plainToClass } from 'class-transformer';
import { CatOutputSchema } from '../../../schemas/cat-output.schema';

export class CatOutputSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: 1,
      name: 'John',
      description: 'Doe',
      isActive: true,
    };
  }

  static createSchema(): CatOutputSchema {
    return plainToClass(CatOutputSchema, CatOutputSchemaHelper.createPlain());
  }
}
