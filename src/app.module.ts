// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { DownloaderModule } from './downloader/downloader.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('BOT_TOKEN') as string,
        // LaunchOptions ni umuman qoldirmaslik - default polling
      }),
    }),

    BotModule,
    DownloaderModule,
  ],
})
export class AppModule {}
