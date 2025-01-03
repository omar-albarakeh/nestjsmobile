// AuthController
import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Res,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUpDto';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ status: string; message: string; data: { token: string } }> {
    const token = await this.authService.signUp(signUpDto);
    return {
      status: 'success',
      message: 'User successfully registered.',
      data: { token },
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: string; message: string; data: { accessToken: string } }> {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      status: 'success',
      message: 'Login successful.',
      data: { accessToken },
    };
  }

  @Post('/refresh-token')
  async refreshAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ status: string; data: { accessToken: string } }> {
    const newAccessToken = await this.authService.refreshToken(refreshToken);
    return {
      status: 'success',
      data: { accessToken: newAccessToken },
    };
  }

  @Get('/user-info')
  async getUserInfo(@Request() req: any): Promise<{ status: string; data: any }> {
    const token = this.extractToken(req.headers.authorization);
    const userInfo = await this.authService.getUserInfoFromToken(token);
    return {
      status: 'success',
      data: userInfo,
    };
  }

  private extractToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header missing.');
    }

    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Malformed authorization header.');
    }

    return parts[1];
  }
}
