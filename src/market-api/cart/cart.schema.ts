import { Schema, Document, Types } from 'mongoose';

export const CartItemSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true, default: 1 },
});

export const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, 
    items: [CartItemSchema],
});

export interface CartItem extends Document {
    item: Types.ObjectId; 
    quantity: number;
}

export interface Cart extends Document {
    user: Types.ObjectId;
    items: CartItem[];
}