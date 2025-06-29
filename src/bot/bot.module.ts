// bot/bot.module.ts
import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { DownloaderModule } from '../downloader/downloader.module';

@Module({
  imports: [
    DownloaderModule, // Faqat kerakli modullarni import qiling
  ],
  providers: [BotUpdate, BotService],
  exports: [BotService], // Agar boshqa modullar ishlatsa
})
export class BotModule {}
