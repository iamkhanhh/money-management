import { IsNotEmpty } from 'class-validator';

export class ChangePassswordDto {
  @IsNotEmpty()
  readonly curPassword: String;

  @IsNotEmpty()
  readonly newPassword: String;

  @IsNotEmpty()
  readonly confPassword: String;
}