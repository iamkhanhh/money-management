import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module, flatten } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          // host: process.env.MAIL_HOST,
          service: 'gmail',
          secure: false,
          // secure: true,
          // port: 465,
          // debug: true,
          // logger: true,
          // secureConnection: false,
          auth: {
            user: 'khanh9102004@gmail.com',
            pass: '94314129',
          },
          // tls: {
          //   rejectUnauthorized: true
          // }
        },
        defaults: {
          from: `"No Reply" <${process.env.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
  constructor() {
    
  }
}
