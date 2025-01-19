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
  Param,
  NotFoundException,
  ConflictException,
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
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ status: string; message: string; data: { token: string } }> {
    try {
      const token = await this.authService.signUp(signUpDto);
      return {
        status: 'success',
        message: 'User successfully registered.',
        data: { token },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during sign up.');
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: string; message: string; data: { accessToken: string; isSolarInfoComplete: boolean } }> {
    try {
      const { accessToken, refreshToken, isSolarInfoComplete } = await this.authService.login(loginDto);

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
    } catch (error) {
      throw new UnauthorizedException('Invalid login credentials.');
    }
  }

  @Post('/refresh-token')
  async refreshAccessToken(@Req() req: Request): Promise<{ status: string; data: { accessToken: string } }> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    try {
      const newAccessToken = await this.authService.refreshToken(refreshToken);
      return {
        status: 'success',
        data: { accessToken: newAccessToken },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  @Get('/user-info')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: Request): Promise<{ status: string; data: any }> {
    try {
      const token = this.extractToken(req.headers.authorization);
      const userInfo = await this.authService.getUserInfoFromToken(token);
      return {
        status: 'success',
        data: userInfo,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to retrieve user info.');
    }
  }

  @Post('/mark-solar-info-complete')
  @UseGuards(AuthGuard('jwt'))
  async markSolarInfoComplete(@Req() req: Request): Promise<{ status: string; message: string }> {
    try {
      const token = this.extractToken(req.headers.authorization);
      await this.authService.markSolarInfoComplete(token);
      return {
        status: 'success',
        message: 'Solar information marked as complete.',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to mark solar info complete.');
    }
  }

  @Post('/update-solar-info')
  @UseGuards(AuthGuard('jwt'))
  async updateSolarInfo(
    @Body() updateSolarInfoDto: UpdateSolarInfoDto,
    @Req() req: Request,
  ): Promise<{ status: string; message: string }> {
    try {
      const token = this.extractToken(req.headers.authorization);
      await this.authService.updateSolarInfo(token, updateSolarInfoDto);
      return {
        status: 'success',
        message: 'Solar information updated successfully.',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update solar info.');
    }
  }

  @Get('/contacts')
  @UseGuards(AuthGuard('jwt'))
  async getAllContacts(): Promise<{ status: string; data: any[] }> {
    try {
      const contacts = await this.authService.getAllContacts();
      return {
        status: 'success',
        data: contacts,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch contacts.');
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async fetchCurrentUser(@Req() req: Request): Promise<{ status: string; data: any }> {
    try {
      const token = this.extractToken(req.headers.authorization);
      const user = await this.authService.fetchCurrentUser(token);
      return {
        status: 'success',
        data: user,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to fetch current user.');
    }
  }

  @Post('/block/:userId')
  @UseGuards(AuthGuard('jwt'))
  async blockUser(@Param('userId') userId: string): Promise<{ status: string; message: string; user: User }> {
    try {
      const user = await this.authService.blockUser(userId);
      return {
        status: 'success',
        message: `User ${user.name} has been successfully blocked.`,
        user,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to block user.');
    }
  }

  @Post('/unblock/:userId')
  @UseGuards(AuthGuard('jwt'))
  async unblockUser(@Param('userId') userId: string): Promise<{ status: string; message: string; user: User }> {
    try {
      const user = await this.authService.unblockUser(userId);
      return {
        status: 'success',
        message: `User ${user.name} has been successfully unblocked.`,
        user,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to unblock user.');
    }
  }

  @Get('/users')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<{ status: string; data: any[] }> {
    try {
      const users = await this.authService.getAllUsers();
      return {
        status: 'success',
        data: users,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users.');
    }
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
}