import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateItemDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    capacity?: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsNumber()
    @IsOptional()
    quantity?: number;
}