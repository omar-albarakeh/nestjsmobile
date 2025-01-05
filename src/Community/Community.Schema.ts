import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {CommentSchema } from './Comment.Schema';

@Schema()
export class CommunityPost extends Document {
  @Prop({ required: true })
  postId: string; 

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  image?: string; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [String], default: [] })
  likes: string[]; 

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ required: true })
  createdBy: string; 
}

export const CommunityPostSchema = SchemaFactory.createForClass(CommunityPost);