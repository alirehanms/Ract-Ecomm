// // order.controller.ts
// import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
// import { OrderService } from './order.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { Order } from './entities/order.entity';


// @Controller('orders')
// export class OrderController {
//   constructor(private readonly orderService: OrderService) {}

//   @Post()
//   async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
//     const order = await this.orderService.create(createOrderDto);
//     return {
//       id: order.id,
//       buyer: order.buyer.id,
//       productId: order.product.id,
//       status: order.status,
//     };
//   }

//   @Get()
//   async findAll(): Promise<OrderDto[]> {
//     const orders = await this.orderService.findAll();
//     return orders.map((order) => ({
//       id: order.id,
//       buyerId: order.buyer.id,
//       productId: order.product.id,
//       status: order.status,
//     }));
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string): Promise<OrderDto> {
//     const order = await this.orderService.findOne(+id);
//     return {
//       id: order.id,
//       buyerId: order.buyer.id,
//       productId: order.product.id,
//       status: order.status,
//     };
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string): Promise<void> {
//     await this.orderService.remove(+id);
//   }
// }



// order.controller.ts

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
  @Put(':id')
  async updateOrderStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }
  @Get()
  async findAll(): Promise<Order[]> {
    return await this.orderService.findAllOrders();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.orderService.findOrderById(+id);
  }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() updateOrderDto: CreateOrderDto): Promise<Order> {
  //   return await this.orderService.updateOrder(+id, updateOrderDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.orderService.deleteOrder(+id);
  }
}
