// import { Injectable } from '@nestjs/common';
// import { Context } from 'telegraf';
// import { createWriteStream, unlink, existsSync } from 'fs';
// import { randomUUID } from 'crypto';
// import { join } from 'path';
// import axios from 'axios';
// import { exec } from 'child_process';
// import { promisify } from 'util';

// const execAsync = promisify(exec);

// @Injectable()
// export class ShazamService {
//   async recognize(ctx: Context) {
//     // Tip xavfsizligini ta'minlash uchun: ctx.message as any
//     const message = ctx.message as any;
//     const voice = message?.voice;
//     if (!voice || !voice.file_id) {
//       await ctx.reply('❗ Audio (voice) topilmadi.');
//       return;
//     }
//     try {
//       const fileId = voice.file_id;
//       const fileLink = await ctx.telegram.getFileLink(fileId);
//       const filename = `shazam-${randomUUID()}.ogg`;
//       const filepath = join(__dirname, '..', '..', 'temp', filename);
//       // Audio faylni yuklab olish
//       const response = await axios.get(fileLink.href, {
//         responseType: 'stream',
//       });
//       const writer = createWriteStream(filepath);
//       response.data.pipe(writer);
//       await new Promise<void>((resolve, reject) => {
//         writer.on('finish', resolve);
//         writer.on('error', reject);
//       });
//       // Shazam analiz
//       const result = await this.callPythonShazam(filepath);
//       if (result) {
//         await ctx.reply(
//           `🎵 Topildi:\n\n🎼 Title: ${result.title}\n👤 Artist: ${result.artist}`,
//         );
//       } else {
//         await ctx.reply('❌ Qo\'shiq topilmadi.');
//       }
//       // Vaqtinchalik faylni o'chirish
//       unlink(filepath, () => {});
//     } catch (err) {
//       console.error(err);
//       await ctx.reply(
//         '❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.',
//       );
//     }
//   }

//   // Video faylidan audio ajratish va Shazam orqali tahlil qilish
//   async recognizeFromVideoFile(videoPath: string): Promise<{ title: string; artist: string } | null> {
//     try {
//       // Video fayl mavjudligini tekshirish
//       if (!existsSync(videoPath)) {
//         console.error('Video fayl topilmadi:', videoPath);
//         return null;
//       }

//       // Audio ajratish uchun vaqtinchalik fayl nomi
//       const audioFilename = `audio-${randomUUID()}.mp3`;
//       const audioPath = join(__dirname, '..', '..', 'temp', audioFilename);

//       // FFmpeg yordamida video faylidan audio ajratish (Windows uchun)
//       const ffmpegCommand = process.platform === 'win32' 
//         ? `ffmpeg.exe -i "${videoPath}" -vn -acodec mp3 -ar 44100 -ac 2 -ab 192k -f mp3 "${audioPath}"`
//         : `ffmpeg -i "${videoPath}" -vn -acodec mp3 -ar 44100 -ac 2 -ab 192k -f mp3 "${audioPath}"`;
      
//       await execAsync(ffmpegCommand);

//       // Audio fayl yaratilganligini tekshirish
//       if (!existsSync(audioPath)) {
//         console.error('Audio fayl yaratilmadi:', audioPath);
//         return null;
//       }

//       // Shazam orqali audio faylni tahlil qilish
//       const result = await this.callPythonShazam(audioPath);

//       // Vaqtinchalik audio faylni o'chirish
//       unlink(audioPath, (err) => {
//         if (err) console.error('Audio faylni o\'chirishda xatolik:', err);
//       });

//       return result;
//     } catch (error) {
//       console.error('Video faylidan audio ajratishda xatolik:', error);
//       return null;
//     }
//   }

//   // Telegram video xabaridan audio ajratish va tahlil qilish
//   async recognizeFromTelegramVideo(ctx: Context): Promise<void> {
//     try {
//       const message = ctx.message as any;
//       const video = message?.video;
      
//       if (!video || !video.file_id) {
//         await ctx.reply('❗ Video fayl topilmadi.');
//         return;
//       }

//       await ctx.reply('🎵 Video faylidan audio ajratib olayapman...');

//       // Video faylni yuklab olish
//       const fileId = video.file_id;
//       const fileLink = await ctx.telegram.getFileLink(fileId);
//       const videoFilename = `video-${randomUUID()}.mp4`;
//       const videoPath = join(__dirname, '..', '..', 'temp', videoFilename);

//       // Video faylni saqlash
//       const response = await axios.get(fileLink.href, {
//         responseType: 'stream',
//       });
//       const writer = createWriteStream(videoPath);
//       response.data.pipe(writer);
      
//       await new Promise<void>((resolve, reject) => {
//         writer.on('finish', resolve);
//         writer.on('error', reject);
//       });

//       // Video faylidan audio ajratish va Shazam tahlili
//       const result = await this.recognizeFromVideoFile(videoPath);

//       // Video faylni o'chirish
//       unlink(videoPath, (err) => {
//         if (err) console.error('Video faylni o\'chirishda xatolik:', err);
//       });

//       // Natijani yuborish
//       if (result) {
//         await ctx.reply(
//           `🎵 Video musiqasi topildi!\n\n🎼 Title: ${result.title}\n👤 Artist: ${result.artist}`,
//         );
//       } else {
//         await ctx.reply('❌ Video musiqasi topilmadi yoki tanib olinmadi.');
//       }

//     } catch (error) {
//       console.error('Telegram video tahlilida xatolik:', error);
//       await ctx.reply('❌ Video musiqasini tahlil qilishda xatolik yuz berdi.');
//     }
//   }

//   private callPythonShazam(
//     filepath: string,
//   ): Promise<{ title: string; artist: string } | null> {
//     return new Promise((resolve) => {
//       const pythonPath = join(__dirname, 'shazam.py');
//       const command = `python3 "${pythonPath}" "${filepath}"`;
//       exec(command, (error, stdout) => {
//         if (error) {
//           console.error('Python error:', error.message);
//           return resolve(null);
//         }
//         try {
//           const json = JSON.parse(stdout);
//           if (json?.title && json?.artist) {
//             resolve({ title: json.title, artist: json.artist });
//           } else {
//             resolve(null);
//           }
//         } catch (e) {
//           console.error('JSON parse error:', e);
//           resolve(null);
//         }
//       });
//     });
//   }
// }