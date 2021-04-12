import 'reflect-metadata';
import { assert } from 'chai';
import { classToPlain, plainToClass } from 'class-transformer';
import { UserOutputSchemaHelper } from '../../../test/helpers/user/schemas/user-output.schema.helper';
import { UserOutputSchema } from './user-output.schema';

describe('User output schema', () => {
  it('Should transform plain to user output schema', () => {
    const user = UserOutputSchemaHelper.getPlainUser();
    user.password = '123456';

    const userSchema = plainToClass(UserOutputSchema, user);

    assert.equal(userSchema.id, user.id);
    assert.equal(userSchema.firstName, user.firstName);
    assert.equal(userSchema.lastName, user.lastName);
    assert.equal(userSchema.isActive, user.isActive);
    assert.equal(userSchema.id, user.id);
    assert.equal(userSchema.id, user.id);
    assert.doesNotHaveAnyKeys(userSchema, ['password']);
  });

  it('Should transform user output schema to plain', () => {
    const userSchema = UserOutputSchemaHelper.getUserOutputSchema();

    const user = classToPlain(userSchema);

    assert.equal(user.id, userSchema.id);
    assert.equal(user.firstName, userSchema.firstName);
    assert.equal(user.lastName, userSchema.lastName);
    assert.equal(user.isActive, userSchema.isActive);
  });
});
