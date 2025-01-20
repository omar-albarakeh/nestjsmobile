// src/items/item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() // Use the @Schema decorator to define a Mongoose schema
export class Item extends Document {
  @Prop({ type: String, required: true }) // Explicitly define _id as a string
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  quantity: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item); // Create the schema from the class