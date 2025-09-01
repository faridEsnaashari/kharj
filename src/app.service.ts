import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    };
  }
}
