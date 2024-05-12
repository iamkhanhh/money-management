import { IsNotEmpty } from 'class-validator';

export class AutoPlanningDto {
  @IsNotEmpty()
  readonly totalMoney: number;

  @IsNotEmpty()
  readonly expenses: number;

  @IsNotEmpty()
  readonly saving: number;

  readonly food: boolean;

  readonly clothes: boolean;

  readonly education: boolean;

  readonly invest: boolean;

  readonly entertainment: boolean;
}