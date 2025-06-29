import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { exec } from 'child_process';
import { createReadStream, unlink } from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';

@Injectable()
export class YouTubeService {
  async downloadAndSend(ctx: Context, url: string) {
    const filename = `yt-${randomUUID()}.mp4`;
    const filepath = join(__dirname, '..', '..', 'temp', filename);

    const command = `yt-dlp -f mp4 -o "${filepath}" "${url}"`;

    exec(command, async (error) => {
      if (error) {
        console.error(error);
        await ctx.reply('❌ YouTube video yuklab olishda xatolik.');
        return;
      }

      try {
        const stream = createReadStream(filepath);
        await ctx.replyWithVideo({ source: stream });

        // Faylni o‘chirish
        unlink(filepath, () => {});
      } catch (err) {
        console.error(err);
        await ctx.reply('❌ Video yuborishda xatolik yuz berdi.');
      }
    });
  }
}
