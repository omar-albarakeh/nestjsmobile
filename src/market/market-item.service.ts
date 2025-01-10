import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './market-item.repository';
import { Product } from './schema/product.schema';
import { CreateMarketItemDto } from './dto/create-market-item.dto';
import { UpdateMarketItemDto } from './dto/update-market-item.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllItems(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getItemsByCategory(category: string): Promise<Product[]> {
    if (!category) {
      throw new NotFoundException('Category cannot be empty');
    }
    return await this.productRepository.findByCategory(category);
  }

  async getItemById(id: string): Promise<Product> {
    const product = await this.productRepository.findOneById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async createItem(createMarketItemDto: CreateMarketItemDto): Promise<Product> {
    return await this.productRepository.create(createMarketItemDto);
  }

  async updateItem(id: string, updateMarketItemDto: UpdateMarketItemDto): Promise<Product> {
    return await this.productRepository.update(id, updateMarketItemDto);
  }

  async deleteItem(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
