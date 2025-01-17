import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SolarInfo, SolarInfoSchema } from '../../SolarInfo/Solar.Schema';
import { CommunityPost } from '../../Community/Schemas/Communit.posts';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: false })
  isSolarInfoComplete: boolean;

  @Prop({ type: SolarInfoSchema, required: false })
  solarInfo?: SolarInfo;

  @Prop({ type: [{ type: String, ref: 'CommunityPost' }], default: [] })
  communityPosts: string[]; // Reference to CommunityPost IDs

  @Prop({ type: String, ref: 'Cart' })
  cart: string;
}

export const UserSchema = SchemaFactory.createForClass(User);