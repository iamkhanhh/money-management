import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from 'src/entities/budget.entity';
import { Exchange } from 'src/entities/exchange.entity';
import { Income } from 'src/entities/income.entity';
import { Users } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange, Budget, Income, Users])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
