// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Schema as MongooseSchema, Types } from 'mongoose';

// @Schema()
// export class CartItem {
//   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Item', required: true })
//   item: Types.ObjectId;

//   @Prop({ type: Number, required: true, default: 1 })
//   quantity: number;
// }

// export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// @Schema()
// export class Cart extends Document {
//   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
//   user: Types.ObjectId;

//   @Prop({ type: [CartItemSchema], default: [] })
//   items: CartItem[];

//   public addItem(itemId: Types.ObjectId, quantity: number): void {
//     const existingItem = this.items.find((cartItem) => cartItem.item.equals(itemId));
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       this.items.push({ item: itemId, quantity });
//     }
//   }

//   public removeItem(itemId: Types.ObjectId): void {
//     this.items = this.items.filter((cartItem) => !cartItem.item.equals(itemId));
//   }
// }

// export const CartSchema = SchemaFactory.createForClass(Cart);
