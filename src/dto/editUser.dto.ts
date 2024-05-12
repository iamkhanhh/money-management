import { IsNotEmpty } from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  fullName: String;

  @IsNotEmpty()
  userName: String;

  @IsNotEmpty()
  email: String;

  @IsNotEmpty()
  gender: String;

  @IsNotEmpty()
  profession: String;

  @IsNotEmpty()
  date_of_birth: String;
}