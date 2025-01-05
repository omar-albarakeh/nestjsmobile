import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Comment {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

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
}

export const CommunityPostSchema = SchemaFactory.createForClass(CommunityPost);
