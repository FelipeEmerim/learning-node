import { plainToClass } from 'class-transformer';
import { CatOutputSchema } from '../../../schemas/cat-output.schema';

export class CatOutputSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: '7ef3c0ba-03d7-49e4-8d83-7b7b6c8eb929',
      name: 'John',
      description: 'Doe',
      isActive: true,
    };
  }

  static createSchema(): CatOutputSchema {
    return plainToClass(CatOutputSchema, CatOutputSchemaHelper.createPlain());
  }
}
