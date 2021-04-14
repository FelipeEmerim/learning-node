import * as winston from 'winston';
import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { EntityNotFoundError } from 'typeorm';
import { UserEntityHelper } from '../../helpers/user/entites/user.entity.helper';
import { UserRepository } from '../../../src/user/repositories/user.repository';
import { UserService } from '../../../src/user/providers/user.service';
import { UserSchemaHelper } from '../../helpers/user/schemas/user.schema.helper';
import env from '../../../src/app.env';
import { UserUpdateSchema } from '../../../src/user/schemas/user-update.schema';
import User from '../../../src/user/entities/user.entity';

describe('User service', () => {
  const userRepository = sinon.createStubInstance(UserRepository);
  const logger = sinon.stub(winston.createLogger());
  const bcryptMock = sinon.stub(bcrypt);
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should find all users', async () => {
    const user = UserEntityHelper.createEntity();
    const expected = [user];
    userRepository.find.resolves(expected);

    const result = await userService.findAll();

    assert.deepEqual(result, expected);

    sinon.assert.calledOnce(userRepository.find);
    sinon.assert.calledOnce(logger.info);
  });

  it('Should create a user', async () => {
    const user = UserEntityHelper.createEntity();
    user.password = 'Encrypted password';

    const userSchema = UserSchemaHelper.createSchema();
    const { password } = userSchema;

    bcryptMock.hash.withArgs(password, env.SALT).resolves(user.password);

    const expected = user;
    userRepository.save.withArgs(userSchema).resolves(user);

    const result = await userService.create(userSchema);

    assert.deepEqual(result, expected);

    sinon.assert.calledOnce(userRepository.save);
    sinon.assert.calledOnce(logger.info);
    sinon.assert.calledWith(bcryptMock.hash, password, env.SALT);
  });

  it('Should update a user using default values', async () => {
    const user = UserEntityHelper.createEntity();
    const userSchema = plainToClass(UserUpdateSchema, { id: 1 });

    userRepository.save.withArgs(user).resolves(user);

    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userRepository.findOneOrFail.withArgs(userSchema.id).resolves(user);

    const result = await userService.update(userSchema);

    assert.isDefined(result.firstName);
    assert.isDefined(result.lastName);
    assert.isDefined(result.isActive);
    assert.isDefined(result.password);

    sinon.assert.calledOnce(userRepository.save);
    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sinon.assert.calledWith(userRepository.findOneOrFail, userSchema.id);
    sinon.assert.calledTwice(logger.info);
  });

  it('Should update a user using new values', async () => {
    const user = UserEntityHelper.createEntity();
    const userSchema = plainToClass(UserUpdateSchema, {
      id: 1,
      firstName: 'new name',
      lastName: 'new last name',
      isActive: false,
    });

    userRepository.save.withArgs(sinon.match.instanceOf(User)).resolves(user);

    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userRepository.findOneOrFail.withArgs(userSchema.id).resolves(user);

    const result = await userService.update(userSchema);

    assert.equal(result.firstName, userSchema.firstName);
    assert.equal(result.lastName, userSchema.lastName);
    assert.equal(result.isActive, userSchema.isActive);
    assert.isDefined(result.password);

    sinon.assert.calledOnce(userRepository.save);
    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sinon.assert.calledWith(userRepository.findOneOrFail, userSchema.id);
    sinon.assert.calledTwice(logger.info);
  });

  it('Should not update a user because it did not find the user', async () => {
    const userSchema = plainToClass(UserUpdateSchema, {
      id: 1,
      firstName: 'new name',
      lastName: 'new last name',
      isActive: false,
    });

    userRepository.findOneOrFail
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .withArgs(userSchema.id)
      .throws(new EntityNotFoundError(User, null));

    try {
      await userService.update(userSchema);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      sinon.assert.notCalled(userRepository.save);
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sinon.assert.calledWith(userRepository.findOneOrFail, userSchema.id);
      sinon.assert.notCalled(logger.info);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });

  it('Should find a user by id', async () => {
    const user = UserEntityHelper.createEntity();

    userRepository.findOneOrFail
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .withArgs(user.id)
      .resolves(user);
    await userService.findOne(user.id);

    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sinon.assert.calledWith(userRepository.findOneOrFail, user.id);
    sinon.assert.calledOnce(logger.info);
  });

  it('Should not find a user by id because it did not find the user', async () => {
    const user = UserEntityHelper.createEntity();

    userRepository.findOneOrFail
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .withArgs(user.id)
      .throws(new EntityNotFoundError(User, null));

    try {
      await userService.findOne(user.id);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      sinon.assert.notCalled(userRepository.save);
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sinon.assert.calledWith(userRepository.findOneOrFail, user.id);
      sinon.assert.notCalled(logger.info);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });

  it('Should delete a user by id', async () => {
    const user = UserEntityHelper.createEntity();

    userRepository.findOneOrFail
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .withArgs(user.id)
      .resolves(user);

    userRepository.delete.withArgs(user.id).resolves();

    await userService.delete(user.id);
    sinon.assert.notCalled(userRepository.save);
    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sinon.assert.calledWith(userRepository.findOneOrFail, user.id);
    sinon.assert.calledWith(userRepository.delete, user.id);
    sinon.assert.calledTwice(logger.info);
  });

  it('Should not delete a user by id because it did not find any user', async () => {
    const user = UserEntityHelper.createEntity();

    userRepository.findOneOrFail
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .throws(new EntityNotFoundError(User, null));

    try {
      await userService.delete(user.id);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      sinon.assert.notCalled(userRepository.save);
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sinon.assert.calledWith(userRepository.findOneOrFail, user.id);
      sinon.assert.notCalled(logger.info);
      sinon.assert.notCalled(userRepository.delete);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });
});
