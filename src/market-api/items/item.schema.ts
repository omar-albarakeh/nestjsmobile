import { Schema, Document } from 'mongoose';

export const ItemSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    quantity: { type: Number, required: true },
});

export interface Item extends Document {
    name: string;
    price: number;
    capacity: number;
    category: string;
    description: string;
    imageUrl: string;
    quantity: number;
}