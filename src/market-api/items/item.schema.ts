import { Schema, Document } from 'mongoose';

export const ItemSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    quantity: { type: Number, required: true },
});


ItemSchema.virtual('id').get(function () {
    return this._id; 
});


ItemSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export interface Item extends Document {
    id: string;
    name: string;
    price: number;
    capacity: number;
    category: string;
    description: string;
    imageUrl: string;
    quantity: number;
}