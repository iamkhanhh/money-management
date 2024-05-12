import { Controller, Get, Redirect, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { MailService } from './mail/mail.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly mailService: MailService) {}

  @Get('/log-out')
  @Redirect('auth/log-in')
  async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    await res.clearCookie('token');
    return;
  }

  @Get('my-infor')
  @Render('myInfor')
  async showAccount(@Req() req: Request){
    if (req.cookies['token']) {
      var userName = await this.appService.getUserName(req.cookies['token']);
    }
    var data = await this.appService.getInfor(req.cookies['token']);
    return {
      showHeader: true,
      userName,
      data
    }
  }

  @Get()
  @Render('welcome')
  async getHello(@Req() req: Request){
    if (req.cookies['token']) {
      var userName = await this.appService.getUserName(req.cookies['token']);
    }
    return {
      showHeader: true,
      showFooter: true,
      userName
    }
  }

}
