import { IsDate, IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEmpty()
  name: string;

  @IsEmpty()
  isActive: boolean;

  @IsEmpty()
  code: string;

  @IsEmpty()
  @IsDate()
  codeEpx: Date;
}
