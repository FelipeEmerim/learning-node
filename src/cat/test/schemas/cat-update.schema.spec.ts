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
import { ClassValidatorHelper } from '../../../shared/test/helpers/class-validator.helper';
import validationPipeConfigs from '../../../config/class-validator/validation.config';
import { CatUpdateSchema } from '../../schemas/cat-update.schema';
import { CatUpdateSchemaHelper } from '../helpers/schemas/cat-update.schema.helper';

describe('Cat update schema', () => {
  let validationPipe: ValidationPipe;

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: CatUpdateSchema,
    data: '',
  };

  beforeAll(() => {
    validationPipe = new ValidationPipe(validationPipeConfigs);
  });

  it('Should create valid', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();

    const validCat: CatUpdateSchema = await validationPipe.transform(
      cat,
      metadata,
    );

    assert.instanceOf(validCat, CatUpdateSchema);
    assert.equal(validCat.id, cat.id);
    assert.equal(validCat.name, cat.name);
    assert.equal(validCat.description, cat.description);
    assert.equal(validCat.isActive, cat.isActive);
  });

  it('Should create valid without optional properties', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    delete cat.isActive;

    const validCat: CatUpdateSchema = await validationPipe.transform(
      cat,
      metadata,
    );

    assert.instanceOf(validCat, CatUpdateSchema);
    assert.equal(validCat.id, cat.id);
    assert.equal(validCat.name, cat.name);
    assert.equal(validCat.description, cat.description);
    assert.isUndefined(validCat.isActive);
  });

  it('Should validate name is string', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.name = 5;

    await validationPipe
      .transform(cat, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'name',
            IS_STRING,
          ),
        );
      });
  });

  it('Should validate name contains more than 5 characters', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.name = faker.datatype.string(4);

    await validationPipe
      .transform(cat, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'name',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate name contains less than 100 characters', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.name = faker.datatype.string(101);

    await validationPipe
      .transform(cat, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'name',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate description is string', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.description = 5;

    await validationPipe
      .transform(cat, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'description',
            IS_STRING,
          ),
        );
      });
  });

  it('Should validate description contains more than 5 characters', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.description = faker.datatype.string(4);

    await validationPipe
      .transform(cat, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'description',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate description contains less than 100 characters', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.description = faker.datatype.string(101);

    await validationPipe
      .transform(cat, metadata)
      .catch((err: BadRequestException) => {
        assert.isTrue(
          ClassValidatorHelper.checkConstraintFoundOnProperty(
            err,
            'description',
            IS_LENGTH,
          ),
        );
      });
  });

  it('Should validate is active is boolean', async () => {
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.isActive = 'not really';

    await validationPipe
      .transform(cat, metadata)
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
    const cat = CatUpdateSchemaHelper.createPlain();
    cat.id = 1;
    cat.address = faker.address.streetAddress();

    await validationPipe
      .transform(cat, metadata)
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
