import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 7890;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });
  await app.listen(port);
}
bootstrap();
