import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketItem } from './market-item.schema';

@Injectable()
export class MarketItemRepository {
  constructor(
    @InjectModel(MarketItem.name) private readonly marketItemModel: Model<MarketItem>,
  ) {}

  async findAll(): Promise<MarketItem[]> {
    return await this.marketItemModel.find().exec();
  }

  async findByCategory(category: string): Promise<MarketItem[]> {
    return await this.marketItemModel.find({ category }).exec();
  }

  async findById(id: string): Promise<MarketItem | null> {
    return await this.marketItemModel.findById(id).exec();
  }

  async create(marketItemData: Partial<MarketItem>): Promise<MarketItem> {
    const marketItem = new this.marketItemModel(marketItemData);
    return await marketItem.save();
  }
}