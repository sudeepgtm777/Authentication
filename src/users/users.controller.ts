import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({
    summary: 'Signup',
    description: 'Signup to create a User.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Create User',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    example: {
      name: 'Sudeep Gautam',
      email: 'sudeep@gmail.com',
      active: true,
      settings: '68ebd0c16be82eba3f1a9abc',
      _id: '68ebd0c16be82eba3f1a9abe',
      createdAt: '2025-10-12T16:01:05.099Z',
      updatedAt: '2025-10-12T16:01:05.099Z',
      __v: 0,
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('signup')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return {
      message: 'User created successfully',
      user,
    };
  }

  @ApiOperation({
    summary: 'Get all the users',
    description: 'All the users are listed',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
    example: [
      {
        name: 'Sudeep Gautam',
        email: 'sudeep@gmail.com',
        active: true,
        settings: '68ebd0c16be82eba3f1a9abd',
        _id: '68ebd0c16be82eba3f1a9abe',
        createdAt: '2025-10-12T16:01:05.099Z',
        updatedAt: '2025-10-12T16:01:05.099Z',
        __v: 0,
      },
    ],
  })
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Fetch a specific user by their Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    example: {
      name: 'Sudeep Gautam',
      email: 'sudeep@gmail.com',
      settings: {
        _id: '68ebd4815d351fa2c4f37ee8',
        receiveNotificaton: true,
        __v: 0,
      },
      active: true,
      _id: '68ebd0c16be82eba3f1a9abe',
      createdAt: '2025-10-12T16:01:05.099Z',
      updatedAt: '2025-10-12T16:01:05.099Z',
      __v: 0,
    },
  })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not Found', 404);
    const findUser = await this.usersService.getUsersById(id);
    if (!findUser) throw new HttpException('User not Found', 404);
    return findUser;
  }

  @ApiOperation({
    summary: 'Update password of a user',
    description: 'Provide  password to update the user.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Update Password',
  })
  @ApiResponse({
    status: 200,
    description: 'User Updated Successfully',
    example: {
      _id: '68e8c45c0b28f0f72ef6f2ca',
      name: 'Sudeep Gautam',
      email: 'sudeep@gmail.com',
      createdAt: '2025-10-10T08:31:24.675Z',
      updatedAt: '2025-10-13T08:13:23.267Z',
      __v: 0,
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid Id', 400);
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) throw new HttpException('User Not Found', 404);
    return {
      message: 'User Updated Successfully',
      user: updatedUser,
    };
  }

  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Deletes a user by their MongoDB ObjectId.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid Id', 400);
    const deletedUser = await this.usersService.deleteUser(id);
    if (!deletedUser) throw new HttpException('User not found', 404);
    return {
      message: 'User Deleted Successfully',
      user: deletedUser,
    };
  }
}
