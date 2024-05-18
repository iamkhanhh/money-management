import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Users } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JwtModule } from '@nestjs/jwt';
import { FunctionsModule } from './functions/functions.module';
import { ConfigModule } from '@nestjs/config';
import { Exchange } from './entities/exchange.entity';
import { Budget } from './entities/budget.entity';
import { Income } from './entities/income.entity';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.DB_HOST,
      host: 'host.docker.internal',
      port: 3306,  
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Users, Exchange, Budget, Income],
      synchronize: true,
    }),
    AuthModule, 
    DashboardModule,
    JwtModule.register({
      global: true,
      secret: 'project_money_management',
      signOptions: { expiresIn: '1d' },
    }),
    FunctionsModule,
    AdminModule,
    MailModule,
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
