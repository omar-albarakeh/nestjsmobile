import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  IsNumber, 
  MinLength 
} from 'class-validator';

export class Community {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;

  @IsNumber()
  likes: number;

  @IsArray()
  @IsString({ each: true })
  comments: string[];
}
