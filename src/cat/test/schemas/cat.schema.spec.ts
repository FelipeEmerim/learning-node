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
import { CatSchemaHelper } from '../helpers/schemas/cat.schema.helper';
import { CatSchema } from '../../schemas/cat.schema';

describe('Cat schema', () => {
  let validationPipe: ValidationPipe;

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: CatSchema,
    data: '',
  };

  beforeAll(() => {
    validationPipe = new ValidationPipe(validationPipeConfigs);
  });

  it('Should create valid', async () => {
    const cat = CatSchemaHelper.createPlain();

    const validCat: CatSchema = await validationPipe.transform(cat, metadata);

    assert.instanceOf(validCat, CatSchema);
    assert.equal(validCat.name, cat.name);
    assert.equal(validCat.description, cat.description);
    assert.equal(validCat.isActive, cat.isActive);
  });

  it('Should create valid without optional properties', async () => {
    const cat = CatSchemaHelper.createPlain();
    delete cat.isActive;

    const validCat: CatSchema = await validationPipe.transform(cat, metadata);

    assert.instanceOf(validCat, CatSchema);
    assert.equal(validCat.name, cat.name);
    assert.equal(validCat.description, cat.description);
    assert.isUndefined(validCat.isActive);
  });

  it('Should validate name is string', async () => {
    const cat = CatSchemaHelper.createPlain();
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
    const cat = CatSchemaHelper.createPlain();
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
    const cat = CatSchemaHelper.createPlain();
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
    const cat = CatSchemaHelper.createPlain();
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
    const cat = CatSchemaHelper.createPlain();
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
    const cat = CatSchemaHelper.createPlain();
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
    const cat = CatSchemaHelper.createPlain();
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
    const cat = CatSchemaHelper.createPlain();
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
