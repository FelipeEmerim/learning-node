import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import * as sinon from 'sinon';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import * as request from 'supertest';
import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter';
import { UserEntityHelper } from '../../../test/helpers/user/entites/user.entity.helper';
import { UserService } from '../providers/user.service';
import { UserController } from './user.controller';
import { UserOutputSchema } from '../schemas/user-output.schema';
import classValidatorConfigs from '../../config/class-validator/validation.config';
import { UserSchema } from '../schemas/user.schema';
import { IdSchema } from '../../shared/schemas/id.schema';
import { UserUpdateSchema } from '../schemas/user-update.schema';
import { EntityNotFoundError } from 'typeorm';
import User from '../entities/user.entity';

describe('User controller', () => {
  const userService = sinon.createStubInstance(UserService);
  let app: INestApplication;
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

    app = module.createNestApplication();

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

    return request(app.getHttpServer())
      .get('/user')
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);
        const { body } = response;

        assert.isArray(body);
        assert.lengthOf(body, 1);

        const resultUser = body[0];

        sinon.assert.calledOnce(userService.findAll);
        assert.equal(resultUser.id, user.id);
        assert.equal(resultUser.firstName, user.firstName);
        assert.equal(resultUser.lastName, user.lastName);
        assert.equal(resultUser.isActive, user.isActive);
        assert.isUndefined(resultUser.password);
      });
  });

  it('Should create a user', async () => {
    const user = UserEntityHelper.createEntity();
    const userSchema: UserSchema = plainToClass(UserSchema, user);
    const expected = user;

    userService.create.resolves(expected);

    return request(app.getHttpServer())
      .post('/user')
      .send(userSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.CREATED);
        const { body } = response;

        sinon.assert.calledWith(userService.create, userSchema);
        assert.equal(body.id, user.id);
        assert.equal(body.firstName, user.firstName);
        assert.equal(body.lastName, user.lastName);
        assert.equal(body.isActive, user.isActive);
        assert.isUndefined(body.password);
      });
  });

  it('Should not create an user, invalid data supplied', async () => {
    const user = UserEntityHelper.createEntity();
    const expected = user;

    userService.create.resolves(expected);

    return request(app.getHttpServer())
      .post('/user')
      .send({})
      .then((response) => {
        assert.equal(response.status, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.equal(response.body.statusCode, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.isArray(response.body.message);
        sinon.assert.notCalled(userService.create);
      });
  });

  it('Should find a user by id', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);
    const expected = user;

    userService.findOne.resolves(expected);

    return request(app.getHttpServer())
      .get(`/user/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);
        const resultUser = response.body;

        sinon.assert.calledOnceWithExactly(userService.findOne, idSchema.id);
        assert.equal(resultUser.id, user.id);
        assert.equal(resultUser.firstName, user.firstName);
        assert.equal(resultUser.lastName, user.lastName);
        assert.equal(resultUser.isActive, user.isActive);
        assert.isUndefined(resultUser.password);
      });
  });

  it('Should find a user by id but not found', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);

    userService.findOne.throws(new EntityNotFoundError(User, idSchema.id));

    return request(app.getHttpServer())
      .get(`/user/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NOT_FOUND);
        assert.equal(response.body.status, HttpStatus.NOT_FOUND);
        assert.isDefined(response.body.message);
        sinon.assert.calledOnceWithExactly(userService.findOne, idSchema.id);
      });
  });

  it('Should update a user by id', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);
    const userSchema: UserUpdateSchema = plainToClass(UserUpdateSchema, user);
    userSchema.id = idSchema.id;

    userService.update.resolves(user);

    return request(app.getHttpServer())
      .put(`/user/${idSchema.id}`)
      .send(userSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);
        const resultUser = response.body;

        sinon.assert.calledOnceWithExactly(userService.update, userSchema);
        assert.equal(resultUser.id, user.id);
        assert.equal(resultUser.firstName, user.firstName);
        assert.equal(resultUser.lastName, user.lastName);
        assert.equal(resultUser.isActive, user.isActive);
        assert.isUndefined(resultUser.password);
      });
  });

  it('Should not update a user by id because not found', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);
    const userSchema: UserUpdateSchema = plainToClass(UserUpdateSchema, user);
    userSchema.id = idSchema.id;

    userService.update.throws(new EntityNotFoundError(User, idSchema.id));

    return request(app.getHttpServer())
      .put(`/user/${idSchema.id}`)
      .send(userSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NOT_FOUND);
        assert.equal(response.body.status, HttpStatus.NOT_FOUND);
        assert.isDefined(response.body.message);
        sinon.assert.calledOnceWithExactly(userService.update, userSchema);
      });
  });

  it('Should not update a user by id because invalid data', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);

    return request(app.getHttpServer())
      .put(`/user/${idSchema.id}`)
      .send({})
      .then((response) => {
        assert.equal(response.status, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.equal(response.body.statusCode, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.isArray(response.body.message);
        sinon.assert.notCalled(userService.update);
      });
  });

  it('Should delete a user by id', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);

    userService.delete.resolves();

    return request(app.getHttpServer())
      .delete(`/user/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NO_CONTENT);
        assert.isObject(response.body);
        assert.isEmpty(response.body);
        sinon.assert.calledOnceWithExactly(userService.delete, idSchema.id);
      });
  });

  it('Should delete a user by id', async () => {
    const user = UserEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, user);

    userService.delete.throws(new EntityNotFoundError(User, idSchema.id));

    return request(app.getHttpServer())
      .delete(`/user/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NOT_FOUND);
        assert.equal(response.body.status, HttpStatus.NOT_FOUND);
        assert.isDefined(response.body.message);
        sinon.assert.calledOnceWithExactly(userService.delete, idSchema.id);
      });
  });
});
