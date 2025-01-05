import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class Comment {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);