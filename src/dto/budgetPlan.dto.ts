import { IsNotEmpty } from 'class-validator';

export class BudgetPlanDto {
  @IsNotEmpty()
  totalMoney: number;

  @IsNotEmpty()
  food: number;

  @IsNotEmpty()
  entertainment: number;

  @IsNotEmpty()
  education: number;

  @IsNotEmpty()
  clothes: number;

  @IsNotEmpty()
  invest: number;

  @IsNotEmpty()
  other: number;
}