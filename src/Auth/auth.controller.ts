import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  InternalServerErrorException,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUpDto';
import { LoginDto } from './dto/LoginDto';
import { UpdateSolarInfoDto } from './dto/UpdateSolarInfoDto';
import { User } from './schemas/user.schema'; 

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
  ): Promise<{
    status: string;
    message: string;
    data: { accessToken: string; isSolarInfoComplete: boolean };
  }> {
    const { accessToken, refreshToken, isSolarInfoComplete } =
      await this.authService.login(loginDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      status: 'success',
      message: 'Login successful.',
      data: { accessToken, isSolarInfoComplete },
    };
  }

  @Post('/refresh-token')
  async refreshAccessToken(
    @Req() req: Request,
  ): Promise<{ status: string; data: { accessToken: string } }> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    const newAccessToken = await this.authService.refreshToken(refreshToken);
    return {
      status: 'success',
      data: { accessToken: newAccessToken },
    };
  }

  @Get('/user-info')
  async getUserInfo(@Req() req: Request): Promise<{ status: string; data: any }> {
    const token = this.extractToken(req.headers.authorization);
    const userInfo = await this.authService.getUserInfoFromToken(token);
    return {
      status: 'success',
      data: userInfo,
    };
  }

  @Post('/mark-solar-info-complete')
  async markSolarInfoComplete(
    @Req() req: Request,
  ): Promise<{ status: string; message: string }> {
    const token = this.extractToken(req.headers.authorization);
    await this.authService.markSolarInfoComplete(token);
    return {
      status: 'success',
      message: 'Solar information marked as complete.',
    };
  }

  @Post('/update-solar-info')
  async updateSolarInfo(
    @Body() updateSolarInfoDto: UpdateSolarInfoDto,
    @Req() req: Request,
  ): Promise<{ status: string; message: string }> {
    const token = this.extractToken(req.headers.authorization);
    await this.authService.updateSolarInfo(token, updateSolarInfoDto);
    return {
      status: 'success',
      message: 'Solar information updated successfully.',
    };
  }

  private extractToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Malformed authorization header.');
    }

    return parts[1];
  }

@Get('/contacts')
@UseGuards(AuthGuard)
async getAllContacts(): Promise<{ status: string; data: any[] }> {
  try {
    const contacts = await this.authService.getAllContacts();

    return {
      status: 'success',
      data: contacts,
    };
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    throw new InternalServerErrorException('Failed to fetch contacts');
  }
}


 
}
