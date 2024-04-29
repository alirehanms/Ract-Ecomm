
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  
  async updateOrderStatus(id: number, status: string) {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    return this.orderRepository.save(order);
  }
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { buyerId, productId } = createOrderDto;

    const order = new Order();
    order.buyer_id = buyerId;
    order.product_id = productId[0];

    return this.orderRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['buyer', 'product'] });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: id },
    
    relations: ['buyer', 'product'] });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // async updateOrder(id: number, updateOrderDto: CreateOrderDto): Promise<Order> {
  //   const { buyerId, product } = updateOrderDto;
  //   const order = await this.findOrderById(id);
  //   order.buyer = buyerId;
  //   order.product = product;
  //   // order.status = status;
  //   return await this.orderRepository.save(order);
  // }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    await this.orderRepository.remove(order);
  }
}
