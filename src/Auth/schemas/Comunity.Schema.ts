import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Community {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: [String], default: [] })
  comments: string[];
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
