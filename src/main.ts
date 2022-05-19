import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger3 } from './logger3/logger3.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true //전역적으로 validationpipe를 사용하기 위함
  }));
  app.use(logger3);
  await app.listen(3000);
}
bootstrap();
