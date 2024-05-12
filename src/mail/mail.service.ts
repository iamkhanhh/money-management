import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation() {

    await this.mailerService.sendMail({
      to: 'khanh9102004@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './test', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: 'iamkhanhh',
      },
    });
  }
}

