import { Document } from 'mongoose';

export interface Item extends Document {
    name: string;
    price: number;
    category: string;
     capacity: number;
    description: string;
    imageUrl: string;
    quantity: number;
}