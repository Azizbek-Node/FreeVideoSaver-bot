// bot/bot.update.ts
import { Injectable } from '@nestjs/common';
import { Update, Start, Ctx, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';

@Update()
@Injectable() // Bu decorator qo'shing
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const user = ctx.from?.first_name || 'foydalanuvchi';
    await ctx.reply(
      `Salom, ${user}! 👋\n\n` +
        `📥 Menga video link yuboring:\n` +
        `• TikTok\n` +
        `• YouTube\n` +
        `• Instagram\n\n` +
        `🎵 Yoki audio yuboring (Shazam)`,
    );
  }

  @On('voice')
  async onVoice(@Ctx() ctx: Context) {
    try {
      await this.botService.handleVoice(ctx);
    } catch (error) {
      console.error('Voice handling error:', error);
      await ctx.reply('❌ Audio qayta ishlashda xatolik yuz berdi.');
    }
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    try {
      // Type safety uchun
      const message =
        ctx.message && 'text' in ctx.message ? ctx.message.text : '';

      if (!message) {
        await ctx.reply('❗ Matn xabari olinmadi.');
        return;
      }

      await this.botService.handleText(ctx, message);
    } catch (error) {
      console.error('Text handling error:', error);
      await ctx.reply('❌ Xabar qayta ishlashda xatolik yuz berdi.');
    }
  }

  // Qo'shimcha handler - boshqa turdagi fayllar uchun
  @On('document')
  async onDocument(@Ctx() ctx: Context) {
    await ctx.reply(
      '📄 Hujjat qabul qilindi, lekin hozir faqat audio va video linklar bilan ishlayman.',
    );
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    await ctx.reply(
      '🖼️ Rasm qabul qilindi, lekin hozir faqat audio va video linklar bilan ishlayman.',
    );
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context) {
    await ctx.reply(
      '🎥 Video fayl qabul qilindi, lekin hozir faqat linklar bilan ishlayman. Video linkini yuboring.',
    );
  }
}
