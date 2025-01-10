import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketItemController } from './market-item.controller';
import { MarketItemService } from './market-item.service';
import { MarketItemRepository } from './market-item.repository';
import { MarketItem, MarketItemSchema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MarketItem.name, schema: MarketItemSchema }]),
  ],
  controllers: [MarketItemController],
  providers: [MarketItemService, MarketItemRepository],
})
export class MarketModule {}