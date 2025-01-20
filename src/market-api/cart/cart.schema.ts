import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cart extends Document {
  @Prop({ type: String, ref: 'User' }) // Add userId field
  userId: string;

  @Prop({ type: [{ type: String, ref: 'Item' }] }) // Use String instead of ObjectId
  items: string[];

  @Prop({ type: Map, of: Number, default: {} })
  quantities: Map<string, number>;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);