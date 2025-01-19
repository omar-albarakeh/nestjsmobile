import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { SolarInfo, SolarInfoSchema } from '../../SolarInfo/Solar.Schema';
import { UserType } from '../user-type.enum';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Object.values(UserType) })
  type: UserType;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: false })
  isSolarInfoComplete: boolean;

  @Prop({ type: SolarInfoSchema, required: false })
  solarInfo?: SolarInfo;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CommunityPost' }],
    default: [],
  })
  communityPosts: Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Cart', required: false })
  cart?: Types.ObjectId;

  @Prop({ default: false })
  blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);