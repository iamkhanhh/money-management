import { IsNotEmpty } from 'class-validator';

export class ChangeInforDto {
  @IsNotEmpty()
  readonly fullName: String;

  @IsNotEmpty()
  readonly userName: String;
}