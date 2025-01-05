import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  IsNumber, 
  MinLength, 
  ValidateNested, 
  IsOptional 
} from 'class-validator';
import { Type } from 'class-transformer';

class Comment {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Comment must not be empty' })
  comment: string;

  @IsOptional()
  @IsString()
  createdAt?: string; 
}

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
  @IsString()
  createdAt?: string;

  @IsNumber()
  likes: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Comment)
  comments: Comment[];
}
