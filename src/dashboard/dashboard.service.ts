import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DashboardService {
  constructor(private jwtService: JwtService) {}

  async getInfor(cookie: string) {
    const payload = await this.jwtService.verifyAsync(cookie,{ secret: process.env.JWT_SECRET_KEY})
    return {
      userName: payload.userName,
      userRole: payload.userRole
    };
  }
}
