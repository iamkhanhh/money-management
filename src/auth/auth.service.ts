import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dto/login.dto';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { ChangeInforDto } from 'src/dto/changeInfor.dto';
import { ChangePassswordDto } from 'src/dto/changePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService
  ) { }

  async getUserByToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token,{ secret: process.env.JWT_SECRET_KEY});
    const data = await this.usersRepository.findOneBy({
      id: payload.id,
    })
    return {  
      userName: data.userName,
      password: data.password,
      email: data.email,
      gender: data.gender,
      profession: data.profession,
      fullName: data.fullName,
      date_of_birth: data.date_of_birth,
    }
  }

  async login(loginDto: LoginDto) {
    const data = await this.usersRepository.findOneBy({
      userName: loginDto.userName as string,
    })
    if (!data) {
      throw new BadRequestException('Invalid credentials !');
    }
    if(data.isDeleted) {
      throw new BadRequestException('This account has been removed due to suspicious behavior !');
    }

    if (!await bcrypt.compare(loginDto.password as string, data.password as string)) {
      throw new HttpException('Password did not match !', 404);
    }

    const accessToken = await this.jwtService.signAsync({userID: data.id, userName: data.userName, userRole: data.role}, {
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync({userID: data.id, userName: data.userName, userRole: data.role}, {
      expiresIn: '7d',
    });

    const expiresIn = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

    return {userName: data.userName, token: accessToken, refreshToken, expiresIn}

  }

  async signUp(signUpDto: SignUpDto) {
    const isValidUserName = await this.usersRepository.findOneBy({
      userName: signUpDto.userName as string,
    })
    if (isValidUserName) {
      throw new BadRequestException('This userName already exists !');
    }

    if (signUpDto.password != signUpDto.confirmPassword) {
      throw new HttpException('Password did not match !', 404);
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password as string, 12);

    const user = new Users();
    user.userName = signUpDto.userName as string;
    user.password = hashedPassword;
    user.email = signUpDto.email as string;
    user.fullName = signUpDto.fullName as string;
    user.gender = signUpDto.gender as string;
    user.profession = signUpDto.profession as string;
    user.date_of_birth = signUpDto.date_of_birth; 
    user.role = 'user';
    user.isDeleted = false;
    const userSaved = await this.usersRepository.save(user);

    const payload = { userID: userSaved.id, userName: userSaved.userName, userRole: userSaved.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const expiresIn = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

    return {
      token: accessToken,
      userName:  userSaved.userName,
      refreshToken,
      expiresIn
    };
  }

  async changeInfor(changeInforDto: ChangeInforDto, cookie: string) {
    const payload = await this.jwtService.verifyAsync(cookie,{ secret: process.env.JWT_SECRET_KEY});
    await this.usersRepository.update({id: payload.userID}, {
      fullName: changeInforDto.fullName as string,
      userName: changeInforDto.userName as string
    })

    const newPayload = { userID: payload.userID, userName: changeInforDto.userName, userRole: payload.userRole };
    const newJwt = await this.jwtService.signAsync(newPayload);

    return newJwt;
  }

  async changePassword(changePasswordDto: ChangePassswordDto, cookie: string) {
    const payload = await this.jwtService.verifyAsync(cookie,{ secret: process.env.JWT_SECRET_KEY});

    const data = await this.usersRepository.findOneBy({
      id: payload.userID,
    })
    if (!await bcrypt.compare(changePasswordDto.curPassword as string, data.password as string)) {
      throw new HttpException('The current assword did not match !', 404);
    }

    if (changePasswordDto.newPassword != changePasswordDto.confPassword) {
      throw new BadRequestException('The new password and the confirm password did not match !');
    } else if (changePasswordDto.newPassword == changePasswordDto.curPassword) {
      throw new BadRequestException('The new password can not be the same with the current password !');
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword as string, 12);
    return await this.usersRepository.update({id: payload.userID}, {
      password: hashedPassword
    })
  }
}