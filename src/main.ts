import {
  HttpStatus,
  ValidationPipe,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Reflector, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import env from './app.env';
import { AppModule } from './app.module';
import { EntityNotFoundFilter } from './shared/filters/entity-not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(env.PORT, env.HOST);
}
bootstrap();
