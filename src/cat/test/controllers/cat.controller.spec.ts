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
import { EntityNotFoundFilter } from '../../../shared/filters/entity-not-found.filter';
import classValidatorConfigs from '../../../config/class-validator/validation.config';
import { IdSchema } from '../../../shared/schemas/id.schema';
import { EntityNotFoundError } from '../../../shared/exceptions/entity-not-found.exception';
import { CatService } from '../../providers/cat.service';
import { CatController } from '../../controllers/cat.controller';
import { CatEntityHelper } from '../helpers/entites/cat.entity.helper';
import { CatSchema } from '../../schemas/cat.schema';
import { CatUpdateSchema } from '../../schemas/cat-update.schema';

describe('Cat controller', () => {
  const catService = sinon.createStubInstance(CatService);
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        {
          provide: CatService,
          useValue: catService,
        },
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(classValidatorConfigs));

    app.useGlobalFilters(new EntityNotFoundFilter());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should find all cats', async () => {
    const cat = CatEntityHelper.createEntity();
    const expected = [cat];

    catService.findAll.resolves(expected);

    return request(app.getHttpServer())
      .get('/cat')
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);
        const { body } = response;

        assert.isArray(body);
        assert.lengthOf(body, 1);

        const resultCat = body[0];

        sinon.assert.calledOnce(catService.findAll);
        assert.equal(resultCat.id, cat.id);
        assert.equal(resultCat.name, cat.name);
        assert.equal(resultCat.description, cat.description);
        assert.equal(resultCat.isActive, cat.isActive);
      });
  });

  it('Should create a cat', async () => {
    const cat = CatEntityHelper.createEntity();
    const catSchema = plainToClass(CatSchema, cat);
    const expected = cat;

    catService.create.resolves(expected);

    return request(app.getHttpServer())
      .post('/cat')
      .send(catSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.CREATED);
        const { body } = response;

        sinon.assert.calledWith(catService.create, catSchema);
        assert.equal(body.id, cat.id);
        assert.equal(body.name, cat.name);
        assert.equal(body.description, cat.description);
        assert.equal(body.isActive, cat.isActive);
      });
  });

  it('Should not create a cat, invalid data supplied', async () => {
    return request(app.getHttpServer())
      .post('/cat')
      .send({})
      .then((response) => {
        assert.equal(response.status, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.equal(response.body.statusCode, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.equal(response.body.error, 'Unprocessable Entity');
        assert.isArray(response.body.message);
        sinon.assert.notCalled(catService.create);
      });
  });

  it('Should find a cat by id', async () => {
    const cat = CatEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, cat);
    const expected = cat;

    catService.findOne.resolves(expected);

    return request(app.getHttpServer())
      .get(`/cat/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);
        const resultCat = response.body;

        sinon.assert.calledOnceWithExactly(catService.findOne, idSchema.id);
        assert.equal(resultCat.id, cat.id);
        assert.equal(resultCat.name, cat.name);
        assert.equal(resultCat.description, cat.description);
        assert.equal(resultCat.isActive, cat.isActive);
      });
  });

  it('Should find a cat by id but not found', async () => {
    const cat = CatEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, cat);

    catService.findOne.throws(new EntityNotFoundError());

    return request(app.getHttpServer())
      .get(`/cat/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NOT_FOUND);
        assert.equal(response.body.statusCode, HttpStatus.NOT_FOUND);
        assert.equal(response.body.error, 'Not Found');
        assert.isDefined(response.body.message);
        sinon.assert.calledOnceWithExactly(catService.findOne, idSchema.id);
      });
  });

  it('Should update a cat by id', async () => {
    const cat = CatEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, cat);
    const catSchema: CatUpdateSchema = plainToClass(CatUpdateSchema, cat);
    catSchema.id = idSchema.id;

    catService.update.resolves(cat);

    return request(app.getHttpServer())
      .put(`/cat/${idSchema.id}`)
      .send(catSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);
        const resultCat = response.body;

        sinon.assert.calledOnceWithExactly(catService.update, catSchema);
        assert.equal(resultCat.id, cat.id);
        assert.equal(resultCat.name, cat.name);
        assert.equal(resultCat.description, cat.description);
        assert.equal(resultCat.isActive, cat.isActive);
      });
  });

  it('Should not update a cat by id because not found', async () => {
    const cat = CatEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, cat);
    const catSchema: CatUpdateSchema = plainToClass(CatUpdateSchema, cat);
    catSchema.id = idSchema.id;

    catService.update.throws(new EntityNotFoundError());

    return request(app.getHttpServer())
      .put(`/cat/${idSchema.id}`)
      .send(catSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NOT_FOUND);
        assert.equal(response.body.statusCode, HttpStatus.NOT_FOUND);
        assert.equal(response.body.error, 'Not Found');
        assert.isDefined(response.body.message);
        sinon.assert.calledOnceWithExactly(catService.update, catSchema);
      });
  });

  it('Should not update a cat by id because invalid data', async () => {
    const cat = CatEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, cat);

    return request(app.getHttpServer())
      .put(`/cat/${idSchema.id}`)
      .send({})
      .then((response) => {
        assert.equal(response.status, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.equal(response.body.statusCode, HttpStatus.UNPROCESSABLE_ENTITY);
        assert.equal(response.body.error, 'Unprocessable Entity');
        assert.isArray(response.body.message);
        sinon.assert.notCalled(catService.update);
      });
  });

  it('Should delete a cat by id', async () => {
    const cat = CatEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, cat);

    catService.delete.resolves();

    return request(app.getHttpServer())
      .delete(`/cat/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NO_CONTENT);
        assert.isObject(response.body);
        assert.isEmpty(response.body);
        sinon.assert.calledOnceWithExactly(catService.delete, idSchema.id);
      });
  });

  it('Should not delete a cat by id because not found', async () => {
    const cat = CatEntityHelper.createEntity();
    const idSchema: IdSchema = plainToClass(IdSchema, cat);

    catService.delete.throws(new EntityNotFoundError());

    return request(app.getHttpServer())
      .delete(`/cat/${idSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NOT_FOUND);
        assert.equal(response.body.statusCode, HttpStatus.NOT_FOUND);
        assert.equal(response.body.error, 'Not Found');
        assert.isDefined(response.body.message);
        sinon.assert.calledOnceWithExactly(catService.delete, idSchema.id);
      });
  });
});
