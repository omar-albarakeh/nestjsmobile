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
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUpDto';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ status: string; message: string; data: { token: string } }> {
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
      throw new BadRequestException('Signup failed. Please try again.');
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ status: string; message: string; data: { token: string } }> {
    try {
      const token = await this.authService.login(loginDto);
      return {
        status: 'success',
        message: 'Login successful.',
        data: { token },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Login failed. Please check your credentials.');
    }
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async getUserInfo(
    @Request() req: any,
  ): Promise<{ status: string; message: string; data: any }> {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new UnauthorizedException('Authorization header missing.');
      }

      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided.');
      }

      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      if (!decoded || !decoded.name) {
        throw new UnauthorizedException('Invalid or malformed token.');
      }

      const user = await this.authService.getUserInfoByName(decoded.name);
      return {
        status: 'success',
        message: 'User information retrieved successfully.',
        data: user,
      };
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      throw new UnauthorizedException('Failed to retrieve user information.');
    }
  }
}
