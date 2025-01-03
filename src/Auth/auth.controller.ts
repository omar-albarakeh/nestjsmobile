import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Request,
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

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ status: string; message: string; data: { token: string } }> {
    try {
      const token = await this.authService.login(loginDto);
      return {
        status: 'success',
        message: 'Login successful. Welcome back!',
        data: { token },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please check your credentials and try again.');
    }
  }
  @Get('/user/:name')
  @HttpCode(HttpStatus.OK)
  async getUserInfoByName(
    @Param('name') name: string,
    @Request() req: any, 
  ): Promise<{ status: string; message: string; data: any }> {
    try {
      const user = await this.authService.getUserInfoByName(name);

      return {
        status: 'success',
        message: 'User information retrieved successfully.',
        data: user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve user information.');
    }
  }
}