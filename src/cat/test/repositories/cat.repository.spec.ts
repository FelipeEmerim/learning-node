import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import * as sinon from 'sinon';
import KnexBuilder, { Knex } from 'knex';
import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { CatSchemaHelper } from '../helpers/schemas/cat.schema.helper';
import { EntityNotFoundError } from '../../../shared/exceptions/entity-not-found.exception';
import { Cat } from '../../entities/cat.entity';
import knexConfigs from '../../database/knexfile';
import { CatRepository } from '../../repositories/cat.repository';

describe('Cat repository', () => {
  let catRepository: CatRepository;
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

    await knex.seed.run({ specific: '01-insert-cats-seed.ts' });

    const module = await Test.createTestingModule({
      imports: [
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
        CatRepository,
        {
          provide: CatRepository.KNEX_TOKEN,
          useValue: knex,
        },
      ],
    }).compile();

    catRepository = module.get<CatRepository>(CatRepository);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should find all cats', async () => {
    const cats = await catRepository.find();

    assert.lengthOf(cats, 3);
  });

  it('Should create a cat', async () => {
    const cat = CatSchemaHelper.createSchema();

    const dbCat = await catRepository.save(cat);

    assert.equal(dbCat.name, cat.name);
    assert.equal(dbCat.description, cat.description);
    assert.equal(dbCat.isActive, cat.isActive);

    assert.isDefined(dbCat.id);
    assert.isDefined(dbCat.createdAt);
    assert.isDefined(dbCat.updatedAt);
  });

  it('Should update a cat', async () => {
    const cat = {
      id: 1,
      name: 'Cool first name',
    };

    const oldValues = (await catRepository.findOne(1)) as Cat;

    const newValues = await catRepository.save(cat);

    assert.equal(newValues.name, cat.name);
    assert.equal(newValues.id, oldValues.id);
    assert.equal(newValues.isActive, oldValues.isActive);
    assert.equal(newValues.description, oldValues.description);

    assert.deepEqual(newValues.createdAt, oldValues.createdAt);
    assert.notDeepEqual(newValues.updatedAt, oldValues.updatedAt);
  });

  it('Should find a cat by id', async () => {
    const cat = (await catRepository.findOne(1)) as Cat;

    assert.equal(cat.id, 1);
    assert.equal(cat.name, 'Romero');
    assert.equal(cat.description, 'Britto');
    assert.equal(cat.isActive, true);
    assert.isDefined(cat.createdAt);
    assert.isDefined(cat.updatedAt);
  });

  it('Should find a cat by id or fail: success', async () => {
    const cat = (await catRepository.findOneOrFail(1)) as Cat;

    assert.equal(cat.id, 1);
    assert.equal(cat.name, 'Romero');
    assert.equal(cat.description, 'Britto');
    assert.equal(cat.isActive, true);
    assert.isDefined(cat.createdAt);
    assert.isDefined(cat.updatedAt);
  });

  it('Should find a cat by id or fail: fail', async () => {
    try {
      await catRepository.findOneOrFail(4);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });

  it('Should delete a cat by id', async () => {
    await catRepository.delete(1);

    const cat = await catRepository.findOne(1);

    assert.isNull(cat);
  });
});
