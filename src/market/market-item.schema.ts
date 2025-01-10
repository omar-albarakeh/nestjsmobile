import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MarketItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  imageUrl: string;
}

export const MarketItemSchema = SchemaFactory.createForClass(MarketItem);