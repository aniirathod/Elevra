import { IsEmail, IsNotEmpty } from 'class-validator';

export class WaitlistDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
