import { Schema } from 'mongoose';

export const CartItemSchema = new Schema({
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true }, // Reference to Item collection
    quantity: { type: Number, required: true, default: 1 },
});

export const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
});

export interface CartItem extends Document {
    itemId: string;Q
    quantity: number;
}

export interface Cart extends Document {
    userId: string;
    items: CartItem[];
}