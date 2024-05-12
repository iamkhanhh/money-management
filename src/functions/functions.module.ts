import { Module } from '@nestjs/common';
import { FunctionsController } from './functions.controller';
import { FunctionsService } from './functions.service';
import { Exchange } from 'src/entities/exchange.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from 'src/entities/budget.entity';
import { Income } from 'src/entities/income.entity';
import { Users } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange, Budget, Income, Users])],
  controllers: [FunctionsController],
  providers: [FunctionsService],
})
export class FunctionsModule {}
