import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { UserType } from '../user-type.enum';

export class SignUpDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  readonly password: string;

  @IsNotEmpty({ message: 'User type is required' })
  @Matches(/^(admin|user|engineer)$/i, {
    message: 'Type must be either admin, user, or engineer',
  })
  readonly type: UserType;

  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^\d{8}$/, { message: 'Phone must be a valid 8-digit number' })
  readonly phone: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  readonly address: string;
}