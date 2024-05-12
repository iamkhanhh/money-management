import { IsNotEmpty } from 'class-validator';

export class SearchUserDto {
  
  id: number;

  userName: String;

  profession: String;

  gender: String;
}