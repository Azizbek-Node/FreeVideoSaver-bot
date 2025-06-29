import { Injectable } from '@nestjs/common';
import { InstagramService } from 'src/downloader/instagram/instagram.service';
import { TikTokService } from 'src/downloader/tiktok/tiktok.service';
import { YouTubeService } from 'src/downloader/youtube/youtube.service';
import { Context } from 'telegraf';

@Injectable()
export class BotService {
  constructor(
    private readonly youtubeService: YouTubeService,
    private readonly instagramService: InstagramService,
    private readonly tiktokService: TikTokService,
  ) {}

  async handleText(ctx: Context, message: string) {
    try {
      const userId = ctx.from?.id?.toString() || 'unknown';

      if (message.includes('youtube.com') || message.includes('youtu.be')) {
        await ctx.reply('📥 YouTube videoni yuklab olayapman...');
        await this.youtubeService.downloadAndSend(ctx, message);
      } else if (message.includes('tiktok.com')) {
        await ctx.reply('📥 TikTok videoni yuklab olayapman...');
        await this.tiktokService.downloadAndSend(ctx, message);
      } else if (message.includes('instagram.com')) {
        await ctx.reply('📥 Instagram videoni yuklab olayapman...');
        await this.instagramService.downloadAndSend(ctx, message);
      } else {
        await ctx.reply(
          '❗ Notogri link. TikTok, YouTube, Instagram link yuboring.',
        );
      }
    } catch (err) {
      console.error(err);
      await ctx.reply('❌ Video yuklab olishda xatolik.');
    }
  }

  async handleVoice(ctx: Context) {
    await ctx.reply("🔊 Audio fayllar hozircha qo'llab-quvvatlanmaydi.");
  }

  async handleVideo(ctx: Context) {
    await ctx.reply('🎥 Video fayllar yuborilgan. Rahmat!');
  }
}
