import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SolarInfo {
  @Prop({ required: true })
  panelsNb: string;

  @Prop({ required: true })
  panelEfficiency: string;

  @Prop({ required: true })
  panelWatt: string;

  @Prop({ required: true })
  panelArea: string;
}

export const SolarInfoSchema = SchemaFactory.createForClass(SolarInfo);