import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  NotFoundException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

// import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
 import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
export class UserController {
  authService: any;
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
   return this.userService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

 
  // @Get(':userId/orders')
  // async getOrders(@Param('userId') userId: number): Promise<any> {
  //   try {
  //     return await this.userService.getUserOrders(userId);
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error while getting orders');
  //   }
  // }

  // @Get('orders')
  // async getAllOrders(): Promise<any> {
  //   try {
  //     return await this.userService.getAllOrders();
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error while getting all orders');
  //   }
  // }

  // @Put('orders/:orderId/status')
  // async updateOrderStatus(
  //   @Param('orderId') orderId: number,
  //   @Body() body: any,
  // ): Promise<any> {
  //   try {
  //     const { status } = body;
  //     return await this.userService.updateOrderStatus(orderId, status);
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error while updating order status');
  //   }
  // }

  // @Put('profile/update')
  // async updateProfile(@Body() body: any): Promise<any> {
  //   try {
  //     return await this.userService.updateProfile(body);
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error while updating profile');
  //   }
  // }

  // @Get('test')
  // test(): string {
  //   return 'Protected Routes';
  // }
}
