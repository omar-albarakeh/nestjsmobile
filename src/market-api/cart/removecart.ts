
import { IsString } from 'class-validator';

export class RemoveFromCartDto {
  @IsString()
  itemId: string;
}