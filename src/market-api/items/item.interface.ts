import { Document } from 'mongoose';

export interface Item extends Document {
    _id: string;
    name: string;
    price: number;
    capacity: number;
    category: string;
    description: string;
    imageUrl: string;
    quantity: number;
}