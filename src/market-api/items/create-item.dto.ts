import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateItemDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    category: string;

    @IsNumber()
    capacity: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsNumber()
    quantity: number;
}