import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthPayloadDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @ApiOperation({
    summary: 'Login',
    description: 'Login to the app.',
  })
  @ApiBody({
    description: 'User login data',
    type: AuthPayloadDto,
    examples: {
      example1: {
        summary: 'Sample login payload',
        value: {
          email: 'sudeep@gmail.com',
          password: 'abcde1234',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Logged in  successfully',
    example: {
      token: 'token_id_creation',
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    // Return with token
    return req.user;
  }

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
}
