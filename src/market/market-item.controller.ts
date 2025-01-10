import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './market-item.service';
import { Product } from './schema/product.schema';
import { CreateMarketItemDto } from './dto/create-market-item.dto';

@Controller('market')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/items')
  async getAllItems(): Promise<Product[]> {
    return await this.productService.getAllItems();
  }

  @Get('/items/category')
  async getItemsByCategory(@Query('category') category: string): Promise<Product[]> {
    if (!category) {
      throw new BadRequestException('Category is required');
    }

    return await this.productService.getItemsByCategory(category);
  }

  @Get('/items/:id')
  async getItemById(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.getItemById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  @Post('/items')
  async createItem(@Body() createMarketItemDto: CreateMarketItemDto): Promise<Product> {
    return await this.productService.createItem(createMarketItemDto);
  }
}
