import { IsString, IsOptional, IsEmail, MinLength, Matches } from 'class-validator';
import { UserType } from '../user-type.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly type?: UserType;
}