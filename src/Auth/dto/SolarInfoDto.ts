import { IsNotEmpty, IsString } from 'class-validator';

export class SolarInfoDto {
  @IsNotEmpty({ message: 'Number of panels is required' })
  @IsString()
  panelsNb: string;

  @IsNotEmpty({ message: 'Panel efficiency is required' })
  @IsString()
  panelEfficiency: string;

  @IsNotEmpty({ message: 'Panel wattage is required' })
  @IsString()
  panelWatt: string;

  @IsNotEmpty({ message: 'Panel area is required' })
  @IsString()
  panelArea: string;
}
