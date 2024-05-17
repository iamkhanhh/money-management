import { IsNotEmpty } from 'class-validator';

export class BudgetPlanDto {
  @IsNotEmpty()
  totalMoney: string;

  expenses: string;

  saving: string;

  @IsNotEmpty()
  food: string;

  @IsNotEmpty()
  entertainment: string;

  @IsNotEmpty()
  education: string;

  @IsNotEmpty()
  clothes: string;

  @IsNotEmpty()
  invest: string;

  @IsNotEmpty()
  other: string;
}