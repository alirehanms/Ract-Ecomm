import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Headers,
  HttpException,
  HttpStatus,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
// import { UpdateProfileDto } from '../dto/update-user.dto';
// import { UpdateProfileDto } from '../dto/update-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  create(
    @Body() user: CreateUserDto,
  ): Promise<{ status: number; message: string; user?: User }> {
    return this.authService.create(user);
  }
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ status: number; message: string; token?: string; user?: User }> {
    return this.authService.login(loginDto);
  }
  @Post('/forgotpassword')
  async forgotPassword(@Body() loginDto: LoginDto) {
    return this.authService.forgotPassword(loginDto);
  }
  @Get('/check-auth')
  async checkAuth(
    @Headers('authorization') token: string,
  ): Promise<{ isAuthenticated: boolean }> {
    return this.authService.checkAuth(token);
  }

  @Get('/authenticate')
  //  @UseGuards(JwtAuthGuard)
  async authenticateUser(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ isAuthenticated: boolean; message: string }> {
    const isAuthenticated = await this.authService.authenticateUser(
      credentials.email,
      credentials.password,
    );
    return {
      isAuthenticated,
      message: isAuthenticated
        ? 'User authenticated'
        : 'Invalid email or password',
    };
  }

  @Get('/authenticateAdmin')
  //  @UseGuards(JwtAuthGuard)
  async authenticateAdmin(
    @Body() credentials: { email: string; password: string; role: number },
  ): Promise<{ isAuthenticated: boolean; message: string }> {
    const isAuthenticated = await this.authService.authenticateUser(
      credentials.email,
      credentials.password,
    );
    return {
      isAuthenticated,
      message: isAuthenticated
        ? ' authenticated'
        : 'Invalid email or password or role',
    };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const userId = parseInt(id, 10);
    return this.authService.getUserById(id);
  }

  // @Put('/profile')
  // @UseGuards(JwtAuthGuard)
  // async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
  //   return this.authService.updateProfile(updateProfileDto);
  // }
}