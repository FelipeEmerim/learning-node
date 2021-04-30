import { plainToClass } from 'class-transformer';
import { CatSchema } from '../../../schemas/cat.schema';

export class CatSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      name: 'Robert',
      description: 'Garcia',
      isActive: true,
    };
  }

  static createSchema(): CatSchema {
    return plainToClass(CatSchema, CatSchemaHelper.createPlain());
  }
}
