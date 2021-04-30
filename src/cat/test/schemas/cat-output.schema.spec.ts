import 'reflect-metadata';
import { assert } from 'chai';
import { classToPlain, plainToClass } from 'class-transformer';
import { CatOutputSchemaHelper } from '../helpers/schemas/cat-output.schema.helper';
import { CatOutputSchema } from '../../schemas/cat-output.schema';

describe('Cat output schema', () => {
  it('Should transform plain to cat output schema', () => {
    const cat = CatOutputSchemaHelper.createPlain();
    cat.password = '123456';

    const catSchema = plainToClass(CatOutputSchema, cat);

    assert.equal(catSchema.id, cat.id);
    assert.equal(catSchema.name, cat.name);
    assert.equal(catSchema.description, cat.description);
    assert.equal(catSchema.isActive, cat.isActive);
  });

  it('Should transform cat output schema to plain', () => {
    const catSchema = CatOutputSchemaHelper.createSchema();

    const cat = classToPlain(catSchema);

    assert.equal(cat.id, catSchema.id);
    assert.equal(cat.name, catSchema.name);
    assert.equal(cat.description, catSchema.description);
    assert.equal(cat.isActive, catSchema.isActive);
  });
});
