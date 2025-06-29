// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

async function start() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const appService = app.get(AppService);

  const bot = appService.getBot();
  const PORT = parseInt(
    process.env.PORT || configService.get('PORT') || '3000',
  );
  const DOMAIN = configService.get<string>('WEBHOOK_DOMAIN')!;
  const TOKEN = configService.get<string>('BOT_TOKEN')!;

  console.log(`Webhook handler path: /bot${TOKEN}`);

  app.use(
    await bot.createWebhook({
      domain: DOMAIN,
      path: `/bot${TOKEN}`,
    }),
  );

  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 App running on port ${PORT}`);
}
start();
