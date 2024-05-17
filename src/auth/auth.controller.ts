import { Body, Controller, Get, Post, Redirect, Render, Req, Res, ValidationPipe } from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { SignUpDto } from 'src/dto/signup.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { ChangeInforDto } from 'src/dto/changeInfor.dto';
import { ChangePassswordDto } from 'src/dto/changePassword.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('log-in')
  @Render('auth/login')
  loginGet() {
    return {
      showHeader: false,
      showFooter: false
    }
  }

  @Get('sign-up')
  @Render('auth/signup')
  signUpGet() {
    return {
      showHeader: false,
      showFooter: false
    }
  }

  @Post('log-in')
  @Redirect('/dashboard')
  async login(
    @Body() loginDto: LoginDto,
    @Res({passthrough: true}) res: Response
  ) {
    const { userName, token } = await this.authService.login(loginDto);
    res.cookie('token', token, {httpOnly: true});
    return;
  }

  @Post('sign-up')
  @Redirect('/dashboard')
  async signup(
    @Body(new ValidationPipe()) signupDto: SignUpDto,
    @Res({passthrough: true}) res: Response
  ) {
    const {token, userName} = await this.authService.signUp(signupDto);
    res.cookie('token', token, {httpOnly: true});
  }

  @Post('change-infor')
  @Redirect('/my-infor')
  async changeInfor(
    @Body(new ValidationPipe()) changeInforDto: ChangeInforDto,
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const token = await this.authService.changeInfor(changeInforDto, req.cookies['token']);
    await res.clearCookie('token');
    res.cookie('token', token, {httpOnly: true});
  }

  @Post('change-password')
  @Redirect('/my-infor')
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePassswordDto,
    @Req() req: Request,
  ) {
    return await this.authService.changePassword(changePasswordDto, req.cookies['token']);
  }
}