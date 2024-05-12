import { IsNotEmpty } from 'class-validator';

export class InforReportDto {
  @IsNotEmpty()
  readonly timeStatistic: string;
}