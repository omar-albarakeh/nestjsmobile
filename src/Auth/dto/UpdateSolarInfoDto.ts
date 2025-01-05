import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateSolarInfoDto {
  @IsOptional()
  @IsString()
  readonly panelsNb?: string;

  @IsOptional()
  @IsString()
  readonly panelEfficiency?: string;

  @IsOptional()
  @IsString()
  readonly panelWatt?: string;

  @IsOptional()
  @IsString()
  readonly panelArea?: string;

  @IsOptional()
  @IsNumber()
  readonly inverterCapacity?: number;

  @IsOptional()
  @IsString()
  readonly installationDate?: string;
}
