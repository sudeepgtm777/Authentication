import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('signup')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not Found', 404);
    const findUser = await this.usersService.getUsersById(id);
    if (!findUser) throw new HttpException('User not Found', 404);
    return findUser;
  }
}
