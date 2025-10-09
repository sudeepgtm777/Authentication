import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+(?:\s+[A-Za-z]+)+$/, {
    message:
      'Please enter your full name (first and last), using alphabets only.',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsNotEmpty()
  passwordConfirm: string;
}
