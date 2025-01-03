import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUpDto';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ status: string; message: string; data: { token: string } }> {
    try {
      const token = await this.authService.signUp(signUpDto);
      return {
        status: 'success',
        message: 'User successfully registered. Welcome!',
        data: { token },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        'Signup failed. Please ensure all required fields are correctly filled out and try again.',
      );
    }
  }

 
}
