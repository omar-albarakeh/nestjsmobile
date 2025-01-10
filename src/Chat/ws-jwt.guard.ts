import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service'; // Import AuthService to validate tokens
import { Socket } from 'socket.io'; // Import Socket type from socket.io

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token; // Get token from WebSocket handshake

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify the JWT token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Fetch the user from the database
      const user = await this.authService.fetchCurrentUser(token);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach the user to the WebSocket client for future use
      client.data.user = user;
      return true;
    } catch (error) {
      console.error('WebSocket JWT validation error:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}