import { IsString, IsNotEmpty } from 'class-validator';
export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}