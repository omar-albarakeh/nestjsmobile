import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddToCartDto {
    @IsNotEmpty()
    @IsString()
    itemId: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
export class RemoveFromCartDto {
    @IsNotEmpty()
    @IsString()
    itemId: string;
}