import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Get,
} from '@nestjs/common';

import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
// import { UpdateProfileDto } from '../dto/update-user.dto';
// import { UpdateProfileDto } from '../dto/update-user.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async create(
    userDto: CreateUserDto,
  ): Promise<{ status: number; message: string; user?: User }> {
    const { name, email, password, answer, phone, address, role } = userDto;

    // Check if a user with the same email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user entity
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      answer,
      phone,
      address,
      role,
    });

    try {
      // Save the new user to the database
      const user = await this.userRepository.save(newUser);
      return { status: 200, message: 'User added successfully', user };
    } catch (error) {
      // Handle any database errors
      return { status: 500, message: 'Failed to create user' };
    }
  }
  // async login(loginDto: LoginDto): Promise<{ token: string; user: User }> {
  //   console.log('Received login DTO:', loginDto);
  //   const { email, password } = loginDto;

  //   const user = await this.userRepository.findOne({ where: { email } });

  //   console.log('User retrieved from database:', user);

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   console.log(
  //     'Comparing password:',
  //     password,
  //     'with hashed password:',
  //     user.password,
  //   );

  //   const isPasswordValid = await bcrypt.compare(password, user.password);

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   console.log('Password comparison result:', isPasswordValid);

  //   const token = this.jwtService.sign({ id: user.id });

  //   return { token, user };
  // }

  // async login(
  //   loginDto: LoginDto,
  // ): Promise<{ status: number; message: string; token?: string; user?: User }> {
  //   console.log('Received login DTO:', loginDto);
  //   const { email, password } = loginDto;

  //   const user = await this.userRepository.findOne({ where: { email } });

  //   console.log('User retrieved from database:', user);

  //   if (!user) {
  //     return { status: 401, message: 'Invalid email or password' };
  //   }

  //   console.log(
  //     'Comparing password:',
  //     password,
  //     'with hashed password:',
  //     user.password,
  //   );

  //   const isPasswordValid = await bcrypt.compare(password, user.password);

  //   if (!isPasswordValid) {
  //     return { status: 401, message: 'Invalid email or password' };
  //   }

  //   console.log('Password comparison result:', isPasswordValid);

  //   const token = this.jwtService.sign({ id: user.id, role: user.role });

  //   return { status: 200, message: 'Login successful', token, user };
  // }

  async login(
    loginDto: LoginDto,
  ): Promise<{ status: number; message: string; token?: string; user?: User }> {
    console.log('Received login DTO:', loginDto);
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    console.log('User retrieved from database:', user);

    if (!user) {
      return { status: 401, message: 'Invalid email or password' };
    }

    console.log(
      'Comparing password:',
      password,
      'with hashed password:',
      user.password,
    );

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { status: 401, message: 'Invalid email or password' };
    }

    console.log('Password comparison result:', isPasswordValid);

    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return { status: 200, message: 'Login successful', token, user };
  }

  // async forgotPassword(loginDto: LoginDto) {
  //   const { email, answer, newPassword } = loginDto;

  //   if (!email || !answer || !newPassword) {
  //     throw new BadRequestException(
  //       'Email, answer, and new password are required',
  //     );
  //   }

  //   const user = await this.userRepository.findOne({
  //     where: { email, answer },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   user.password = hashedPassword;

  //   await this.userRepository.save(user);

  //   return { success: true, message: 'Password reset successfully' };
  // }

  async forgotPassword(
    loginDto: LoginDto,
  ): Promise<{ status: number; message: string }> {
    const { email, answer, newPassword } = loginDto;

    if (!email || !answer || !newPassword) {
      throw new BadRequestException(
        'Email, answer, and new password are required',
      );
    }

    const user = await this.userRepository.findOne({
      where: { email, answer },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { status: 200, message: 'Password reset successfully' };
  }

  isAuthenticated(token: string): boolean {
    try {
      // Verify the JWT token
      this.jwtService.verify(token);
      // If the token is valid, the user is authenticated
      return true;
    } catch (error) {
      // If verification fails, the user is not authenticated
      return false;
    }
  }

  // New method to return the authentication status
  checkAuth(token: string): { isAuthenticated: boolean } {
    return { isAuthenticated: this.isAuthenticated(token) };
  }

  async authenticateUser(email: string, password: string): Promise<boolean> {
    // Retrieve user from the database based on the provided email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return false; // User with the provided email does not exist
    }

    // Check that both the password and the hashed password are defined
    if (!password || !user.password) {
      return false;
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  }

  async authenticateAdmin(
    email: string,
    password: string,
    role: number,
  ): Promise<boolean> {
    // Retrieve user from the database based on the provided email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return false; // User with the provided email does not exist
    }

    if (!role || !user.role) {
      return false;
    }

    // Check that both the password and the hashed password are defined
    if (!password || !user.password) {
      return false;
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  }
  ////////////UPDATE//////////////
  // async updateProfile(updateProfileDto: UpdateProfileDto) {
  //   const { id, name, email, password, phone, address } = updateProfileDto;
  //   const user = await this.userRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   user.name = name || user.name;
  //   user.email = email || user.email;
  //   user.password = password || user.password;
  //   user.phone = phone || user.phone;
  //   user.address = address || user.address;

  //    if (password) {
  //      const hashedPassword = await bcrypt.hash(password, 10);
  //      user.password = hashedPassword;
  //    }

  //   await this.userRepository.save(user);

  //     console.log('Updated user:', user);
  //   return {
  //     status: 200,
  //     message: 'Profile updated successfully',
  //     user,
  //   };
  // }
}

