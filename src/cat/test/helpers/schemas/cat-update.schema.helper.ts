import { plainToClass } from 'class-transformer';
import { CatUpdateSchema } from '../../../schemas/cat-update.schema';

export class CatUpdateSchemaHelper {
  // Makes sense to return any because it simulates a request body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      name: 'Robert',
      description: 'Garcia',
      isActive: true,
    };
  }

  static createSchema(): CatUpdateSchema {
    return plainToClass(CatUpdateSchema, CatUpdateSchemaHelper.createPlain());
  }
}
