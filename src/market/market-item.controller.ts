// src/market/controllers/market-item.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { MarketItemService } from './market-item.service';
import { MarketItem } from './schema/product.schema';

@Controller('market')
export class MarketItemController {
  constructor(private readonly marketItemService: MarketItemService) {}

  @Get('/items')
  async getAllItems(): Promise<MarketItem[]> {
    try {
      return await this.marketItemService.getAllItems();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch market items.');
    }
  }

  @Get('/items/category')
  async getItemsByCategory(@Query('category') category: string): Promise<MarketItem[]> {
    try {
      return await this.marketItemService.getItemsByCategory(category);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch items by category.');
    }
  }

  @Get('/items/:id')
  async getItemById(@Param('id') id: string): Promise<MarketItem | null> {
    try {
      return await this.marketItemService.getItemById(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch item by ID.');
    }
  }

  @Post('/items')
  async createItem(@Body() marketItemData: Partial<MarketItem>): Promise<MarketItem> {
    try {
      return await this.marketItemService.createItem(marketItemData);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create market item.');
    }
  }
}