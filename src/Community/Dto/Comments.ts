import { 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsDate 
} from 'class-validator';

export class Comment {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Comment must not be empty' })
  comment: string;

  @IsOptional()
  @IsDate() 
  createdAt?: Date;
}