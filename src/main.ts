// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.API_PORT || 3001;
  await app.listen(PORT);
  console.log(`🚀 App running on port ${PORT}`);
}
start();
