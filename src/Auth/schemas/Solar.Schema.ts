import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SolarInfo extends Document {
  @Prop({ required: false })
  panelsNb?: string;

  @Prop({ required: false })
  panelEfficiency?: string;

  @Prop({ required: false })
  panelWatt?: string;

  @Prop({ required: false })
  panelArea?: string;

  @Prop({ required: false })
  inverterCapacity?: number;

  @Prop({ required: false })
  installationDate?: string;
}

export const SolarInfoSchema = SchemaFactory.createForClass(SolarInfo);