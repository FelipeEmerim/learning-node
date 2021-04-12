import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter';
import { UserEntityHelper } from '../../../test/helpers/user/entites/user.entity.helper';
import { UserService } from '../providers/user.service';
import { UserController } from './user.controller';
import { UserOutputSchema } from '../schemas/user-output.schema';
import classValidatorConfigs from '../../config/class-validator/validation.config';
import { UserSchema } from '../schemas/user.schema';
import { IdSchema } from '../../shared/schemas/id.schema';
import { UserUpdateSchema } from '../schemas/user-update.schema';

describe('User service', () => {
  const userService = sinon.createStubInstance(UserService);
  let userController: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    const app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(classValidatorConfigs));

    app.useGlobalFilters(new EntityNotFoundFilter());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    userController = module.get<UserController>(UserController);

    await app.init();
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should find all users', async () => {
    const user = UserEntityHelper.createEntity();
    const expected = [user];

    userService.findAll.resolves(expected);

    const result = await userController.list();

    assert.lengthOf(result, 1);

    const resultUser = result[0];

    assert.instanceOf(resultUser, UserOutputSchema);

    sinon.assert.calledOnce(userService.findAll);
    assert.equal(resultUser.firstName, user.firstName);
    assert.equal(resultUser.lastName, user.lastName);
    assert.equal(resultUser.isActive, user.isActive);
    assert.isUndefined(resultUser.password);
  });

  it('Should create a user', async () => {
    const user = UserEntityHelper.createEntity();
    const userSchema: UserSchema = plainToClass(UserSchema, user);
    const expected = user;

    userService.create.resolves(expected);

    const result = await userController.post(userSchema);

    assert.instanceOf(result, UserOutputSchema);

    sinon.assert.calledWith(userService.create, userSchema);
    assert.equal(result.firstName, user.firstName);
    assert.equal(result.lastName, user.lastName);
    assert.equal(result.isActive, user.isActive);
    assert.isUndefined(result.password);
  });

  it('Should find a user by id', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);
    const expected = user;

    userService.findOne.resolves(expected);

    const result = await userController.get(idSchema);

    assert.instanceOf(result, UserOutputSchema);

    sinon.assert.calledWith(userService.findOne, user.id);
    assert.equal(result.firstName, user.firstName);
    assert.equal(result.lastName, user.lastName);
    assert.equal(result.isActive, user.isActive);
    assert.isUndefined(result.password);
  });

  it('Should update a user by id', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);
    const userSchema: UserUpdateSchema = plainToClass(UserUpdateSchema, user);
    userSchema.id = 0;
    const expected = user;

    userService.update.resolves(expected);

    const result = await userController.put(idSchema, userSchema);

    assert.instanceOf(result, UserOutputSchema);

    sinon.assert.calledWith(userService.update, userSchema);
    assert.equal(result.firstName, user.firstName);
    assert.equal(result.lastName, user.lastName);
    assert.equal(result.isActive, user.isActive);
    assert.equal(userSchema.id, idSchema.id);
    assert.isUndefined(result.password);
  });

  it('Should delete a user by id', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);

    userService.delete.resolves();

    const result = await userController.delete(idSchema);
    assert.isUndefined(result);

    sinon.assert.calledWith(userService.delete, user.id);
  });
});
