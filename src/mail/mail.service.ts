import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public example(): void {
    this.mailerService
      .sendMail({
        to: 'khanh9102004@gmail.com',
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {
        console.log('sending email!')
      })
      .catch((err) => {
        console.log(err)
      });

      console.log('trong ham example')
  }
}

