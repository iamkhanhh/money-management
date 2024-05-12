import { IsNotEmpty } from 'class-validator';

export class AddTransactionDto {
  @IsNotEmpty()
  readonly name: String;

  @IsNotEmpty()
  readonly payment_method: String;

  @IsNotEmpty()
  readonly category_name: String;

  @IsNotEmpty()
  readonly amount_of_money: number;

  readonly exchange_date: Date;
}