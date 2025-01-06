import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  IsNumber, 
  MinLength, 
  ValidateNested, 
  IsOptional, 
  IsDate 
} from 'class-validator';
import { Type } from 'class-transformer';
import { Comment } from './Comments';

export class CommunityPost {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsNumber()
  likes: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Comment)
  comments: Comment[];
}