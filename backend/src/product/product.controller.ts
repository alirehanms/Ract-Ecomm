import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  ParseIntPipe,
  Put,
  HttpStatus,
  Res,
  NotFoundException,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';

import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { FilterProductDto } from './dto/filter-product.dto';
import { AdminMiddleware } from 'src/middleware/admin.middleware';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(file, createProductDto);
  }
  @Get('getall')
  // @UseGuards(JwtAuthGuard)
  async getAllProducts(@Query() filters: CreateProductDto): Promise<Product[]> {
    return await this.productService.getAllProducts(filters);
  }

  ////new////
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findById(id);
  }

  @Get('photo/:id')
  //@UseGuards(JwtAuthGuard)
  async getProductPhoto(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    await this.productService.getProductPhoto(id, res);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
  ): Promise<{ status: number; message: string }> {
    await this.productService.remove(id);
    return {
      status: HttpStatus.NO_CONTENT,
      message: 'Product removed successfully',
    };
  }
  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() photo: Express.Multer.File,
    @Res() res,
  ) {
    try {
      const updatedProduct = await this.productService.updateProduct(
        id,
        updateProductDto,
        photo,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating product',
        error: error.message,
      });
    }
  }

  @Post('filters')
  // @UseGuards(JwtAuthGuard)
  async filterProducts(
    @Body() filterDto: FilterProductDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { checked, radio } = filterDto;
      const products = await this.productService.filterProducts(checked, radio);
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: 'Error while filtering products',
        error,
      });
    }
  }

  @Get()
  async getProductCount(): Promise<{ success: true; total: number }> {
    try {
      const total = await this.productService.getProductCount();
      return { success: true, total };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list/:page')
  // @UseGuards(JwtAuthGuard)
  async getProductList(@Param('page') page: number, @Res() res: Response) {
    try {
      const perPage = 6; // Number of products per page
      const products = await this.productService.getProductList(page, perPage);
      return res.status(HttpStatus.OK).json({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error in per page ctrl');
    }
  }

  @Get('search/:keyword')
  async searchProducts(@Param('keyword') keyword: string): Promise<any> {
    return this.productService.searchProduct(keyword);
  }
  @Get('related/:pid/:cid')
  // @UseGuards(JwtAuthGuard)
  async getRelatedProducts(
    @Param('pid') pid: number,
    @Param('cid') cid: number,
  ) {
    try {
      const products = await this.productService.getRelatedProducts(pid, cid);
      return { success: true, products };
    } catch (error) {
      throw new BadRequestException('Error while getting related products');
    }
  }
  @Get('related-products/:slug')
  async getRelatedProductsByCategory(@Param('slug') slug: string) {
    try {
      const products =
        await this.productService.getRelatedProductsByCategory(slug);
      return { success: true, products };
    } catch (error) {
      return {
        success: false,
        message: 'Error while getting related products',
        error,
      };
    }
  }

  @Get('token')
  async generateClientToken(): Promise<{ clientToken: string }> {
    const clientToken = await this.productService.generateClientToken();
    return { clientToken };
  }
}
