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


}
