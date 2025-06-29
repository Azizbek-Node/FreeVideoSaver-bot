import { Injectable } from '@nestjs/common';

@Injectable()
export class VideoStorageService {
  private videoStorage = new Map<string, string>(); // userId -> videoPath

  // Video yo'lini saqlash
  setVideoPath(userId: string, videoPath: string): void {
    this.videoStorage.set(userId, videoPath);
  }

  // Video yo'lini olish
  getVideoPath(userId: string): string | null {
    return this.videoStorage.get(userId) || null;
  }

  // Video yo'lini o'chirish
  clearVideoPath(userId: string): void {
    this.videoStorage.delete(userId);
  }

  // Barcha saqlangan yo'llarni ko'rish (debug uchun)
  getAllStoredPaths(): Map<string, string> {
    return new Map(this.videoStorage);
  }
}
