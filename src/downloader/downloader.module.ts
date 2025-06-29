// downloader/downloader.module.ts
import { Module } from '@nestjs/common';
import { YouTubeService } from './youtube/youtube.service';
import { TikTokService } from './tiktok/tiktok.service';
import { InstagramService } from './instagram/instagram.service';
// import { ShazamService } from './shazam/shazam.service'; // Qo'shing

@Module({
  providers: [
    YouTubeService,
    TikTokService,
    InstagramService,
    // ShazamService, // Qo'shing
  ],
  exports: [
    YouTubeService,
    TikTokService,
    InstagramService,
    // ShazamService, // Qo'shing
  ],
})
export class DownloaderModule {}
