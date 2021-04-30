import * as winston from 'winston';
import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import { plainToClass } from 'class-transformer';
import { CatRepository } from '../../repositories/cat.repository';
import { CatService } from '../../providers/cat.service';
import { EntityNotFoundError } from '../../../shared/exceptions/entity-not-found.exception';
import { CatEntityHelper } from '../helpers/entites/cat.entity.helper';
import { CatSchemaHelper } from '../helpers/schemas/cat.schema.helper';
import { CatUpdateSchema } from '../../schemas/cat-update.schema';
import { Cat } from '../../entities/cat.entity';

describe('Cat service', () => {
  const catRepository = sinon.createStubInstance(CatRepository);
  const logger = sinon.stub(winston.createLogger());
  let catService: CatService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: CatRepository,
          useValue: catRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    catService = module.get<CatService>(CatService);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should find all cats', async () => {
    const cat = CatEntityHelper.createEntity();
    const expected = [cat];
    catRepository.find.resolves(expected);

    const result = await catService.findAll();

    assert.deepEqual(result, expected);

    sinon.assert.calledOnce(catRepository.find);
    sinon.assert.calledOnce(logger.info);
  });

  it('Should create a cat', async () => {
    const cat = CatEntityHelper.createEntity();

    const catSchema = CatSchemaHelper.createSchema();

    const expected = cat;
    catRepository.save.withArgs(catSchema).resolves(cat);

    const result = await catService.create(catSchema);

    assert.deepEqual(result, expected);

    sinon.assert.calledOnce(catRepository.save);
    sinon.assert.calledOnce(logger.info);
  });

  it('Should update a cat using default values', async () => {
    const cat = CatEntityHelper.createEntity();
    const catSchema = plainToClass(CatUpdateSchema, { id: 1 });

    catRepository.save.withArgs(cat).resolves(cat);

    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    catRepository.findOneOrFail.withArgs(catSchema.id).resolves(cat);

    const result = await catService.update(catSchema);

    assert.isDefined(result.name);
    assert.isDefined(result.description);
    assert.isDefined(result.isActive);

    sinon.assert.calledOnce(catRepository.save);
    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sinon.assert.calledWith(catRepository.findOneOrFail, catSchema.id);
    sinon.assert.calledTwice(logger.info);
  });

  it('Should update a cat using new values', async () => {
    const cat = CatEntityHelper.createEntity();
    const catSchema = plainToClass(CatUpdateSchema, {
      id: 1,
      name: 'new name',
      description: 'new last name',
      isActive: false,
    });

    catRepository.save.withArgs(sinon.match.instanceOf(Cat)).resolves(cat);

    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    catRepository.findOneOrFail.withArgs(catSchema.id).resolves(cat);

    const result = await catService.update(catSchema);

    assert.equal(result.name, catSchema.name);
    assert.equal(result.description, catSchema.description);
    assert.equal(result.isActive, catSchema.isActive);

    sinon.assert.calledOnce(catRepository.save);
    // sinon is not ok with method overloading
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sinon.assert.calledWith(catRepository.findOneOrFail, catSchema.id);
    sinon.assert.calledTwice(logger.info);
  });

  it('Should not update a cat because it did not find the cat', async () => {
    const catSchema = plainToClass(CatUpdateSchema, {
      id: 1,
      name: 'new name',
      description: 'new last name',
      isActive: false,
    });

    catRepository.findOneOrFail
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .withArgs(catSchema.id)
      .throws(new EntityNotFoundError());

    try {
      await catService.update(catSchema);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      sinon.assert.notCalled(catRepository.save);
      // sinon is not ok with method overloading
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sinon.assert.calledWith(catRepository.findOneOrFail, catSchema.id);
      sinon.assert.notCalled(logger.info);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });

  it('Should find a cat by id', async () => {
    const cat = CatEntityHelper.createEntity();

    catRepository.findOneOrFail.withArgs(cat.id).resolves(cat);
    await catService.findOne(cat.id);

    sinon.assert.calledWith(catRepository.findOneOrFail, cat.id);
    sinon.assert.calledOnce(logger.info);
  });

  it('Should not find a cat by id because it did not find the cat', async () => {
    const cat = CatEntityHelper.createEntity();

    catRepository.findOneOrFail
      .withArgs(cat.id)
      .throws(new EntityNotFoundError());

    try {
      await catService.findOne(cat.id);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      sinon.assert.notCalled(catRepository.save);
      sinon.assert.calledWith(catRepository.findOneOrFail, cat.id);
      sinon.assert.notCalled(logger.info);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });

  it('Should delete a cat by id', async () => {
    const cat = CatEntityHelper.createEntity();

    catRepository.findOneOrFail.withArgs(cat.id).resolves(cat);

    catRepository.delete.withArgs(cat.id).resolves();

    await catService.delete(cat.id);
    sinon.assert.notCalled(catRepository.save);

    sinon.assert.calledWith(catRepository.findOneOrFail, cat.id);
    sinon.assert.calledWith(catRepository.delete, cat.id);
    sinon.assert.calledTwice(logger.info);
  });

  it('Should not delete a cat by id because it did not find any cat', async () => {
    const cat = CatEntityHelper.createEntity();

    catRepository.findOneOrFail.throws(new EntityNotFoundError());

    try {
      await catService.delete(cat.id);
    } catch (error: unknown) {
      assert.instanceOf(error, EntityNotFoundError);
      sinon.assert.notCalled(catRepository.save);

      sinon.assert.calledWith(catRepository.findOneOrFail, cat.id);
      sinon.assert.notCalled(logger.info);
      sinon.assert.notCalled(catRepository.delete);
      return;
    }

    fail('Expected exception to be thrown, but it was not');
  });
});
