import { Injectable } from '@nestjs/common';
import { MarketItemRepository } from './market-item.repository';
import { MarketItem } from './product.schema';

@Injectable()
export class MarketItemService {
  constructor(private readonly marketItemRepository: MarketItemRepository) {}

  async getAllItems(): Promise<MarketItem[]> {
    return await this.marketItemRepository.findAll();
  }

  async getItemsByCategory(category: string): Promise<MarketItem[]> {
    return await this.marketItemRepository.findByCategory(category);
  }

  async getItemById(id: string): Promise<MarketItem | null> {
    return await this.marketItemRepository.findById(id);
  }

  async createItem(marketItemData: Partial<MarketItem>): Promise<MarketItem> {
    return await this.marketItemRepository.create(marketItemData);
  }
}