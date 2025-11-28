import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthPayloadDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email to send reset link' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token received in email' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'New password' })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
