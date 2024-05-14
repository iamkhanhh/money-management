import { IsNotEmpty } from 'class-validator';

export class AutoPlanningDto {
  @IsNotEmpty()
  readonly totalMoney: string;

  @IsNotEmpty()
  readonly expenses: string;

  @IsNotEmpty()
  readonly saving: string;

  readonly food: boolean;

  readonly clothes: boolean;

  readonly education: boolean;

  readonly invest: boolean;

  readonly entertainment: boolean;
}