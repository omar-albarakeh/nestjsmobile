import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class SolarInfo {
  @Prop({ required: true })
  panelsNb: string;

  @Prop({ required: true })
  panelEfficiency: string;

  @Prop({ required: true })
  panelWatt: string;

  @Prop({ required: true })
  panelArea: string;
}

const SolarInfoSchema = SchemaFactory.createForClass(SolarInfo);

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

  @Prop({ type: SolarInfoSchema }) // Embed solarInfo as a subdocument
  solarInfo?: SolarInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
