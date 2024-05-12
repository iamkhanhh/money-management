import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Unique } from "typeorm";

export class SignUpDto {
  @IsNotEmpty()
  readonly fullName: String;

  @IsNotEmpty()
  readonly userName: String;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: String;

  @IsNotEmpty()
  @MinLength(6)
  readonly confirmPassword: String;

  @IsNotEmpty()
  readonly gender: String;

  @IsNotEmpty()
  readonly profession: String;

  @IsNotEmpty()
  readonly date_of_birth: Date;
}