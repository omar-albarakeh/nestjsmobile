import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../Auth/schemas/user.schema';
import { CartItem } from './cart_item';

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [CartItem], required: true })
  items: CartItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  address: string;

  @Prop({ default: 'Pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
