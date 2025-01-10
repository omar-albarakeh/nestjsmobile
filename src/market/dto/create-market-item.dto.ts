import { IsNotEmpty, IsString, IsNumber, IsUrl, IsPositive, IsOptional } from 'class-validator';

export class CreateMarketItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stockQuantity: number;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}