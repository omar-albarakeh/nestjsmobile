import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, IsNumber } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  @IsOptional()
  @IsString({ message: 'Type must be a string' })
  readonly type?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Phone must be a valid number' })
  readonly phone?: number;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  readonly address?: string;
}
