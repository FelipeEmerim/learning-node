import 'reflect-metadata';
import { assert } from 'chai';
import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import {
  IS_BOOLEAN,
  IS_LENGTH,
  IS_STRING,
  ValidationTypes,
} from 'class-validator';
import * as faker from 'faker/locale/en';
import { ClassValidatorHelper } from '../../helpers/shared/class-validator.helper';
import { UserUpdateSchemaHelper } from '../../helpers/user/schemas/user-update.schema.helper';
import validationPipeConfigs from '../../../src/config/class-validator/validation.config';
import { UserUpdateSchema } from '../../../src/user/schemas/user-update.schema';

describe('User update schema', () => {
  let validationPipe: ValidationPipe;

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: UserUpdateSchema,
    data: '',
  };

  beforeAll(() => {
    validationPipe = new ValidationPipe(validationPipeConfigs);
  });

  it('Should create valid', async () => {
    const user = UserUpdateSchemaHelper.createPlain();

    const validUser: UserUpdateSchema = await validationPipe.transform(
      user,
      metadata,
    );

    assert.instanceOf(validUser, UserUpdateSchema);
    assert.equal(validUser.id, user.id);
    assert.equal(validUser.firstName, user.firstName);
    assert.equal(validUser.lastName, user.lastName);
    assert.equal(validUser.isActive, user.isActive);
  });

  it('Should create valid without optional properties', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    delete user.isActive;

    const validUser: UserUpdateSchema = await validationPipe.transform(
      user,
      metadata,
    );

    assert.instanceOf(validUser, UserUpdateSchema);
    assert.equal(validUser.id, user.id);
    assert.equal(validUser.firstName, user.firstName);
    assert.equal(validUser.lastName, user.lastName);
    assert.isUndefined(validUser.isActive);
  });

  it('Should validate first name is string', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.firstName = 5;

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'firstName',
            IS_STRING,
          ),
        );
      });
  });

  it('Should validate first name contains more than 5 characters', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.firstName = faker.datatype.string(4);

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'firstName',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate first name contains less than 100 characters', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.firstName = faker.datatype.string(101);

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'firstName',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate last name is string', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.lastName = 5;

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'lastName',
            IS_STRING,
          ),
        );
      });
  });

  it('Should validate last name contains more than 5 characters', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.lastName = faker.datatype.string(4);

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'lastName',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate last name contains less than 100 characters', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.lastName = faker.datatype.string(101);

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'lastName',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate is active is boolean', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.isActive = 'not really';

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'isActive',
            IS_BOOLEAN,
          ),
        );
      });
  });

  it('Should forbid non mapped properties', async () => {
    const user = UserUpdateSchemaHelper.createPlain();
    user.id = 1;
    user.address = faker.address.streetAddress();

    await validationPipe
      .transform(user, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'id',
            ValidationTypes.WHITELIST,
          ),
        );

        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'address',
            ValidationTypes.WHITELIST,
          ),
        );
      });
  });
});
