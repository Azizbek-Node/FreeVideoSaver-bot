// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class AppService {
  constructor(@InjectBot() private readonly bot: Telegraf) {}

  getBot(): Telegraf {
    return this.bot;
  }
}
