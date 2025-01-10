import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class QueryMarketItemDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
