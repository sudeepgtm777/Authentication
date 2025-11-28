import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Query,
  Body,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthPayloadDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------- SIGNUP -------------------

  @ApiOperation({
    summary: 'Signup',
    description: 'Signup to create a User and send verification email.',
  })
  @ApiBody({ type: CreateUserDto, description: 'Create User' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully. Verification email sent.',
    example: {
      message: 'User created. Please check your email to verify account.',
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  // ------------------- LOGIN -------------------
  @ApiOperation({ summary: 'Login', description: 'Login to the app.' })
  @ApiBody({
    description: 'User login data',
    type: AuthPayloadDto,
    examples: {
      example1: {
        summary: 'Sample login payload',
        value: { email: 'sudeep@gmail.com', password: 'abcde1234' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Logged in successfully',
    example: { token: 'token_id_creation' },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  // ------------------- PROFILE -------------------
  @ApiOperation({
    summary: 'Profile',
    description:
      'After login token is received. Use that token in the authorize 🔒 to get User Profile.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    example: {
      _id: '68e8c45c0b28f0f72ef6f2ca',
      name: 'Sudeep Gautam',
      email: 'sudeep@gmail.com',
      createdAt: '2025-10-10T08:31:24.675Z',
      updatedAt: '2025-10-13T08:21:55.873Z',
      __v: 0,
      iat: 1760345346,
      exp: 1760348946,
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  // ------------------- EMAIL VERIFICATION -------------------
  @ApiOperation({
    summary: 'Verify Email',
    description: 'Verify user email via token sent in email.',
  })
  @ApiResponse({ status: 200, description: 'Email successfully verified.' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token is required');
    return this.authService.verifyEmail(token);
  }

  // ------------------- FORGOT PASSWORD -------------------
  @ApiOperation({
    summary: 'Forgot Password',
    description: 'Send password reset email.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  // ------------------- RESET PASSWORD -------------------
  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset password using token from email.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password successfully reset.' })
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
