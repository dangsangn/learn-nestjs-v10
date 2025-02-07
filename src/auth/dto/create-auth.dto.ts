import { IsNotEmpty, IsEmail, IsEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEmpty()
  name: string;
}

export class VerifyCodeDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  code: string;
}
