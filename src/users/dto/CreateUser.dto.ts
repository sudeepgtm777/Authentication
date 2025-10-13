import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

export class CreateUserSettingsDto {
  @ApiPropertyOptional({
    description: 'Whether the user wants to receive notifications',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  receiveNotificaton?: boolean;
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+(?:\s+[A-Za-z]+)+$/, {
    message:
      'Please enter your full name (first and last), using alphabets only.',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserSettingsDto)
  settings?: CreateUserSettingsDto;
}
