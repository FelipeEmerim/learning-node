import * as winston from 'winston';
import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import * as bcrypt from 'bcrypt';
import { UserEntityHelper } from '../../../test/helpers/user/entites/user.entity.helper';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';
import { UserSchemaHelper } from '../../../test/helpers/user/schemas/user.schema.helper';
import env from '../../app.env';

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
});
