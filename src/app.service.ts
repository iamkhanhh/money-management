import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async getUserName(cookie: string) {
    const payload = await this.jwtService.verifyAsync(cookie,{ secret: process.env.JWT_SECRET_KEY})
    return payload.userName;
  }

  async getInfor(cookie) {
    const payload = await this.jwtService.verifyAsync(cookie,{ secret: process.env.JWT_SECRET_KEY});
    var userInfor = await this.usersRepository.findOneBy({
      id: payload.userID,
    })
    
    var data = {} as any;
    data.userName = userInfor.userName;
    data.fullName = userInfor.fullName;
    return data;
  }
}
