import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Item } from '../items/item.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Item' }], default: [] })
  items: Types.ObjectId[];

  @Prop({ type: Map, of: Number, default: new Map<string, number>() })
  quantities: Map<string, number>;

  @Prop({ type: Number, default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);