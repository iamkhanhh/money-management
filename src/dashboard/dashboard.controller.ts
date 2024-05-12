import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';
import { MailService } from 'src/mail/mail.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly mailService: MailService
  ) {}

  @Get('')
  @Render('dashboard') 
  async dashboard(@Req() req: Request) {
    if (req.cookies['token']) {
      var {userName, userRole} = await this.dashboardService.getInfor(req.cookies['token']);
      var isAdmin = (userRole == 'admin') ? true : false;
    }
    // await this.mailService.sendUserConfirmation();
    return {
      showHeader: true, 
      showFooter: false,
      isAdmin,
      userName
    }
  }
}
