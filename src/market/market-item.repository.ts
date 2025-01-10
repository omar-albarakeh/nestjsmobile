import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketItem } from './schema/product.schema';
import { CreateMarketItemDto } from './dto/create-market-item.dto';
import { UpdateMarketItemDto } from './dto/update-market-item.dto';

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

  async create(createMarketItemDto: CreateMarketItemDto): Promise<MarketItem> {
    const marketItem = new this.marketItemModel(createMarketItemDto);
    return await marketItem.save();
  }

  async update(
    id: string,
    updateMarketItemDto: UpdateMarketItemDto,
  ): Promise<MarketItem | null> {
    return await this.marketItemModel
      .findByIdAndUpdate(id, updateMarketItemDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.marketItemModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}