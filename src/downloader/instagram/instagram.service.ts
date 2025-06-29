import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { exec } from 'child_process';
import { createReadStream, unlink } from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';

@Injectable()
export class InstagramService {
  async downloadAndSend(ctx: Context, url: string) {
    const filename = `ig-${randomUUID()}.mp4`;
    const filepath = join(__dirname, '..', '..', 'temp', filename);

    const command = `yt-dlp -f mp4 -o "${filepath}" "${url}"`;

    exec(command, async (error) => {
      if (error) {
        console.error(error);
        await ctx.reply('❌ Instagram videoni yuklab bo‘lmadi.');
        return;
      }

      try {
        const stream = createReadStream(filepath);
        await ctx.replyWithVideo({ source: stream });

        unlink(filepath, () => {});
      } catch (err) {
        console.error(err);
        await ctx.reply('❌ Video yuborishda xatolik.');
      }
    });
  }
}
