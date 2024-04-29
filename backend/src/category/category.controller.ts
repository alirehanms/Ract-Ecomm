// category.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  NotFoundException,
  UseGuards,
  HttpStatus,
  Res,
  Put,
 
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AdminMiddleware } from 'src/middleware/admin.middleware';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  // @UseMiddleware(AdminMiddleware)
  // @UseGuards(JwtAuthGuard)
  async create(
    @Body('name') name: string,
  ): Promise<{ status: number; message: string; category?: Category }> {
    return await this.categoryService.create(name);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
  ): Promise<{ status: number; message: string; category?: Category }> {
    return await this.categoryService.update(id, name);
  }

  @Get()
  async getCategory() {
    try {
      const result = await this.categoryService.getCategory();
      return result;
    } catch (error) {
      return { status: 404, message: error.message };
    }
  }
  @Get(':id')
  async findOneBySlug(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.findOneBySlug(id);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: number) {
  //   await this.categoryService.remove(id);
  // }

  // @Delete(':id')
  // async remove(
  //   @Param('id') id: number,
  // ): Promise<{ status: number; message: string }> {
  //   await this.categoryService.remove(id);
  //   return { status: HttpStatus.OK, message: 'Category removed successfully' };
  // }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
  ): Promise<{ status: number; message: string }> {
    await this.categoryService.remove(id);
    return {
      status: HttpStatus.NO_CONTENT,
      message: 'Category removed successfully',
    };
  }
}



