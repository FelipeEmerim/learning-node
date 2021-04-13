import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';
import env from './app.env';
import { AppModule } from './app.module';
import { EntityNotFoundFilter } from './shared/filters/entity-not-found.filter';
import classValidatorConfigs from './config/class-validator/validation.config';
import swaggerConfig from './config/open-api/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(new ValidationPipe(classValidatorConfigs));

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.PORT, env.HOST);
}
bootstrap();
