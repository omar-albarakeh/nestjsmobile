import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SolarInfo {
  @Prop({ required: true })
  Panelsnb: string;

  @Prop({ required: true })
  Paneleffiency: string;

  @Prop({ required: true })
  PanelWatt: string;

  @Prop({ required: true })
  PanelArea: string;

  @Prop({ required: true })
  userId: string;
}

export type SolarInfoDocument = SolarInfo & Document;

export const SolarInfoSchema = SchemaFactory.createForClass(SolarInfo);
