
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, In, Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

import formidable from 'formidable';
import * as fs from 'fs';
import * as path from 'path';
import { validate } from 'class-validator';
import slugify from 'slugify';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { File } from 'buffer';
import { Category } from 'src/category/entities/category.entity';
import * as braintree from 'braintree';



// import { format } from 'date-fns';

// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });
@Injectable()
export class ProductService {
  gateway: any;
  categoryRepository: any;
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async generateClientToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response.clientToken);
        }
      });
    });
  }
  async createProduct(
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ): Promise<{ status: number; message: string; product?: Product }> {
    try {
      const { name, description, price, quantity, categoryid, shipping } =
        createProductDto;

      // Define the upload directory relative to the current working directory
      const uploadDir = path.join(process.cwd(), 'uploads');

      // Ensure the upload directory exists, if not, create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate a unique filename with a timestamp
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      // Save the file to the uploads directory
      fs.writeFileSync(filePath, file.buffer);

      const product = new Product();
      product.name = name;
      product.slug = slugify(name);
      product.description = description;
      product.price = price;
      product.quantity = quantity;
      product.categoryid = categoryid;
      product.photo = filePath; // Store the file path
      product.shipping = !!shipping;

      const savedProduct = await this.productRepository.save(product);

      return {
        status: 201,
        message: 'Product created successfully',
        product: savedProduct,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create product');
    }
  }
  async getAllProducts(filters: CreateProductDto): Promise<Product[]> {
    try {
      const query = this.productRepository.createQueryBuilder('product');

      if (filters.categoryid) {
        query.andWhere('product.categoryid = :categoryId', {
          categoryId: filters.categoryid,
        });
      }
      if (filters.price) {
        query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
          minPrice: filters.price[0],
          maxPrice: filters.price[1],
        });
      }

      const products = await query.getMany();
      return products;
    } catch (error) {
      throw new BadRequestException('Error retrieving products');
    }
  }
  /////////new///////
  async findById(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async getProductPhoto(id: number, res: Response): Promise<void> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        select: ['photo'],
      });

      if (!product || !product.photo) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      // Read the file
      const photoPath = product.photo;
      const imageStream = fs.createReadStream(photoPath);

      // Determine content type of the image
      const contentType = this.getContentType(photoPath);

      // Set appropriate content type header
      res.setHeader('Content-Type', contentType);

      // Pipe the image stream to the response
      imageStream.pipe(res);
    } catch (error) {
      throw new BadRequestException('Error retrieving product photo');
    }
  }
  private getContentType(filePath: string): string {
    // Example: Extract file extension and map it to content type
    const extension = filePath.split('.').pop();
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      // Add more cases as needed
      default:
        return 'image/jpeg'; // Default content type
    }
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    photo?: Express.Multer.File,
  ): Promise<{ status: number; message: string; product?: Product }> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      // Update product properties based on the updateProductDto
      product.name = updateProductDto.name;
      product.slug = slugify(updateProductDto.name);
      product.description = updateProductDto.description;
      product.price = updateProductDto.price;
      product.quantity = updateProductDto.quantity;
      product.categoryid = updateProductDto.categoryid;
      product.shipping = !!updateProductDto.shipping;

      // If a new photo is provided, update the photo path
      if (photo) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        const fileName = `${Date.now()}-${photo.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, photo.buffer);
        product.photo = filePath;
      }

      // Save the updated product
      const updatedProduct = await this.productRepository.save(product);

      return {
        status: 200,
        message: 'Product updated successfully',
        product: updatedProduct,
      };
    } catch (error) {
      throw new BadRequestException('Error updating product');
    }
  }

  async remove(id: number): Promise<void> {
    const category = await this.productRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(category);
  }

  async getProductCount(): Promise<number> {
    const count = await this.productRepository
      .createQueryBuilder('product')
      .distinct(true)
      .getCount();
    return Number(count);
  }

  async getProductList(page: number, perPage: number): Promise<Product[]> {
    try {
      const perPage = 3;
      const products = await this.productRepository
        .createQueryBuilder()
        .select(['id', 'name', 'description', 'price', 'categoryid'])
        .skip((page - 1) * perPage)
        .take(perPage)
        .getMany();
      return products;
    } catch (error) {
      throw new BadRequestException('Error getting product list');
    }
  }

  async searchProduct(keyword: any): Promise<Product[]> {
    try {
      const keywordStr =
        typeof keyword === 'string' ? keyword : keyword.toString();
      const results = await this.productRepository
        .createQueryBuilder('product')
        .where('product.name LIKE :keyword', { keyword: `%${keywordStr}%` })
        .orWhere('product.description LIKE :keyword', {
          keyword: `%${keywordStr}%`,
        })
        .getMany();
      return results;
    } catch (error) {
      throw new BadRequestException('Error searching products');
    }
  }
  async getRelatedProducts(pid: number, cid: number): Promise<Product[]> {
    try {
      const relatedProducts = await this.productRepository.find({
        where: {
          categoryid: cid,
          id: Not(pid),
        },
        select: [
          'id',
          'name',
          'slug',
          'description',
          'price',
          'quantity',
          'shipping',
        ],
        relations: ['category'],
        take: 3,
      });
      return relatedProducts;
    } catch (error) {
      throw new BadRequestException('Error getting related products');
    }
  }

  async filterProducts(checked: number[], radio: number[]): Promise<Product[]> {
    try {
      const options: FindManyOptions<Product> = {};

      if (checked.length > 0) {
        options.where = { categoryid: In(checked) };
      }

      if (radio.length === 2) {
        options.where = {
          ...options.where,
          price: Between(radio[0], radio[1]),
        };
      }

      return await this.productRepository.find(options);
    } catch (error) {
      throw new BadRequestException('Error filtering products');
    }
  }

  async getSingleProduct(slug: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { slug } });
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error('Error while getting single product');
    }
  }
  async getRelatedProductsByCategory(slug: string): Promise<Product[]> {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .innerJoinAndSelect('product.category', 'category')
        .where('category.slug = :slug', { slug })
        .getMany();
      return products;
    } catch (error) {
      throw new Error('Error while getting related products');
    }
  }
}