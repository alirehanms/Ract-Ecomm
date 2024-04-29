import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  userModel: any;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const existingUser = await this.userRepository.findOne({
  //     where: { email: createUserDto.email },
  //   });

  //   if (existingUser) {
  //     throw new ConflictException('Email address already exists');
  //   }

  //  const user: User = this.userRepository.create({
  //    name: createUserDto.name,

  //    email: createUserDto.email,
  //    password: createUserDto.password,
  //    answer: createUserDto.answer,
  //    phone: createUserDto.phone,
  //    address: createUserDto.address,
  //  });

  //   return await this.userRepository.save(user);
  // }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  //////////FindbyID////////
  // async findById(id: string): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }

  //   return user;
  // }

  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name'],
    });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log('ID received in update method:', id);
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.name) user.name = updateUserDto.name;

    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password;

    if (updateUserDto.phone) user.phone = updateUserDto.phone;

    if (updateUserDto.address) user.address = updateUserDto.address;

    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.userRepository.remove(user);
  }

  //   async getUserOrders(userId: number): Promise<any> {
  //     const user = await this.userRepository.findOne({ where: {  userId } });
  //     if (!user) {
  //       throw new Error('User not found');
  //     }

  //     const orders = await orderModel
  //       .find({ buyer: userId })
  //       .populate('products', '-photo')
  //       .populate('buyer', 'name');

  //     return orders;
  //   }

  //   async getAllOrders(): Promise<any> {
  //     const orders = await orderModel
  //       .find({})
  //       .populate('products', '-photo')
  //       .populate('buyer', 'name')
  //       .sort({ createdAt: '-1' });

  //     return orders;
  //   }

  //   async updateOrderStatus(orderId: number, status: string): Promise<any> {
  //     const order = await .findByIdAndUpdate(
  //       orderId,
  //       { status },
  //       { new: true },
  //     );
  //     return order;
  //   }
}
