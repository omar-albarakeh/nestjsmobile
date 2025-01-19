import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUpDto';
import { LoginDto } from './dto/LoginDto';
import * as bcrypt from 'bcryptjs';
import { UpdateSolarInfoDto } from './dto/UpdateSolarInfoDto';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateToken(payload: { id: string; email: string; name: string; type: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  private generateRefreshToken(payload: { id: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async signUp(signUpDto: SignUpDto): Promise<string> {
    const { email, password, name, type = 'user', phone, address } = signUpDto;

    if (await this.userRepository.isEmailTaken(email)) {
      throw new ConflictException('Email is already registered.');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      type,
      phone,
      address,
    });

    return this.generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      type: user.type,
    });
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; isSolarInfoComplete: boolean }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user || !(await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = this.generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      type: user.type,
    });

    const refreshToken = this.generateRefreshToken({ id: user._id.toString() });

    return { accessToken, refreshToken, isSolarInfoComplete: user.isSolarInfoComplete };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      return this.generateToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        type: user.type,
      });
    } catch (error) {
      console.error('Refresh token error:', error.message);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async getUserInfoFromToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

      const user = await this.userRepository.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const { password, ...userDetails } = user.toObject({ versionKey: false });

      return userDetails;
    } catch (error) {
      console.error('Get user info error:', error.message);
      throw new UnauthorizedException('Failed to retrieve user information.');
    }
  }

  async markSolarInfoComplete(token: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

      const user = await this.userRepository.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      await this.userRepository.updateUser(user._id.toString(), { isSolarInfoComplete: true });
    } catch (error) {
      console.error('Mark solar info complete error:', error.message);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  async updateSolarInfo(token: string, updateSolarInfoDto: UpdateSolarInfoDto): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

      const user = await this.userRepository.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const updatedUser = await this.userRepository.updateSolarInfo(user._id.toString(), updateSolarInfoDto);

      if (!updatedUser) {
        throw new InternalServerErrorException('Failed to update solar information.');
      }

      return updatedUser;
    } catch (error) {
      console.error('Update solar info error:', error.message);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  async getAllContacts(): Promise<any[]> {
    try {
      const users = await this.userRepository.findAllUsers();

      return users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));
    } catch (error) {
      console.error('Error fetching contacts from the database:', error.message);
      throw new InternalServerErrorException('Failed to fetch contacts');
    }
  }

  async fetchCurrentUser(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

      const user = await this.userRepository.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      const { password, ...userInfo } = user.toObject();
      return userInfo;
    } catch (error) {
      console.error('Error fetching current user:', error.message);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

   async getAllUsers(): Promise<any[]> {
  try {
    const users = await this.userRepository.findAllUsers();
    return users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      blocked: user.blocked, 
    }));
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch users');
  }
}



 async blockUser(userId: string): Promise<User> {
  try {
    return await this.userRepository.blockUser(userId);
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}

async unblockUser(userId: string): Promise<User> {
  try {
    return await this.userRepository.unblockUser(userId);
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}



}
