import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    // Return with token
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
