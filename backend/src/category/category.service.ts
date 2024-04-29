// category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import slugify from 'slugify';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // async create(name: string): Promise<Category> {
  //   const slug = slugify(name);
  //   const existingCategory = await this.categoryRepository.findOne({
  //     where: { name },
  //   });

  //   if (existingCategory) {
  //     throw new NotFoundException('Category already exists');
  //   }

  //   const category = this.categoryRepository.create({ name, slug });
  //   return await this.categoryRepository.save(category);
  // }
  async create(
    name: string,
  ): Promise<{ status: number; message: string; category?: Category }> {
    const slug = slugify(name);
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new NotFoundException('Category already exists');
    }

    const category = this.categoryRepository.create({ name, slug });
    const savedCategory = await this.categoryRepository.save(category);

    return {
      status: 201,
      message: 'Category created successfully',
      category: savedCategory,
    };
  }
  async update(
    id: number,
    name: string,
  ): Promise<{ status: number; message: string; category?: Category }> {
    const slug = slugify(name);
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.name = name;
    category.slug = slug;

    await this.categoryRepository.save(category);

    return { status: 201, message: 'Category updated successfully', category };
  }

  // async findAll(): Promise<Category[]> {
  //   return await this.categoryRepository.find();
  // }
  // async getAllCategories(): Promise<Category[]> {
  //   try {
  //     const categories = await this.categoryRepository.find();
  //     return categories;
  //   } catch (error) {
  //     throw new Error('Failed to fetch categories');
  //   }
  // }

  // async getCategory(): Promise<{ status: number; message: string; category?: Category[] }> {
  //   const category = await this.categoryRepository.find();
  //   if (!category) {
  //     throw new NotFoundException('Category not found');
  //   }
  //   return {
  //     status: 200,
  //     message: 'Category retrieved successfully',
  //     category,
  //   };
  // }

  async getCategory(): Promise<{
    status: number;
    message: string;
    category?: Category[];
  }> {
    const categories = await this.categoryRepository.find();
    if (!categories || categories.length === 0) {
      return {
        status: 404,
        message: 'Category not found',
      };
    }
    return {
      status: 200,
      message: 'Category retrieved successfully',
      category: categories,
    };
  }
  async findOneBySlug(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // async remove(id: number): Promise<{ status: number; message: string,category: Category }> {
  //   const category = await this.categoryRepository.findOne({ where: { id } });

  //   if (!category) {
  //     throw new NotFoundException('Category not found');
  //   }

  //   await this.categoryRepository.remove(category);

  //   return { status: 201, message: 'Category removed successfully',category };
  // }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);
  }
}
