import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import * as sinon from 'sinon';
import KnexBuilder, { Knex } from 'knex';
import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { UserSchemaHelper } from '../../helpers/user/schemas/user.schema.helper';
import { UserRepository } from '../../../src/user/repositories/user.repository';
import { EntityNotFoundError } from '../../../src/shared/exceptions/entity-not-found.exception';
import { User } from '../../../src/user/entities/user.entity';
import { KnexModule, KNEX_MODULE } from '../../../src/knex/knex.module';
import knexConfigs from '../../../src/database/knexfile';

describe('User repository', () => {
  let userRepository: UserRepository;
  let knex: Knex;
  const logger = sinon.stub(winston.createLogger());

  beforeAll(async () => {
    knex = KnexBuilder(knexConfigs);
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.destroy();
  });

  beforeEach(async () => {
    sinon.reset();

    await knex.seed.run({ specific: '01-insert-users-seed.ts' });

    const module = await Test.createTestingModule({
      imports: [
        KnexModule.forRoot(knexConfigs),
        {
          module: WinstonModule,
          providers: [
            {
              provide: WINSTON_MODULE_PROVIDER,
              useValue: logger,
            },
          ],
          exports: [WINSTON_MODULE_PROVIDER],
        },
      ],
      providers: [
        UserRepository,
        {
          provide: KNEX_MODULE,
          useValue: knex,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should find all users', async () => {
    const users = await userRepository.find();

    assert.lengthOf(users, 3);
  });

  it('Should create a user', async () => {
    const user = UserSchemaHelper.createSchema();

    const dbUser = await userRepository.save(user);

    assert.equal(dbUser.firstName, user.firstName);
    assert.equal(dbUser.lastName, user.lastName);
    assert.equal(dbUser.password, user.password);
    assert.equal(dbUser.isActive, user.isActive);

    assert.isDefined(dbUser.id);
    assert.isDefined(dbUser.createdAt);
    assert.isDefined(dbUser.updatedAt);
  });

  it('Should update a user', async () => {
    const user = {
      id: 1,
      firstName: 'Cool first name',
    };

    const oldValues = (await userRepository.findOne(1)) as User;

    const newValues = await userRepository.save(user);

    assert.equal(newValues.firstName, 'Cool first name');
    assert.equal(newValues.id, oldValues.id);
    assert.equal(newValues.isActive, oldValues.isActive);
    assert.equal(newValues.password, oldValues.password);
    assert.equal(newValues.lastName, oldValues.lastName);

    assert.deepEqual(newValues.createdAt, oldValues.createdAt);
    assert.notDeepEqual(newValues.updatedAt, oldValues.updatedAt);
  });

  it('Should find a user by id', async () => {
    const user = (await userRepository.findOne(1)) as User;

    assert.equal(user.id, 1);
    assert.equal(user.firstName, 'Romero');
    assert.equal(user.lastName, 'Britto');
    assert.isDefined(user.password);
    assert.equal(user.isActive, true);
    assert.isDefined(user.createdAt);
    assert.isDefined(user.updatedAt);
  });

  it('Should find a user by id or fail: success', async () => {
    const user = (await userRepository.findOneOrFail(1)) as User;

    assert.equal(user.id, 1);
    assert.equal(user.firstName, 'Romero');
    assert.equal(user.lastName, 'Britto');
    assert.isDefined(user.password);
    assert.equal(user.isActive, true);
    assert.isDefined(user.createdAt);
    assert.isDefined(user.updatedAt);
  });

  it('Should find a user by id or fail: fail', async () => {
    try {
      await userRepository.findOneOrFail(4);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });

  it('Should delete a user by id', async () => {
    await userRepository.delete(1);

    const user = await userRepository.findOne(1);

    assert.isNull(user);
  });
});
