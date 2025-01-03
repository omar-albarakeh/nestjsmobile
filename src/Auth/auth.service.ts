import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUpDto';
import { LoginDto } from './dto/LoginDto';
import * as bcrypt from 'bcryptjs';
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

  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateToken(payload: { id: string; email: string; name: string; type: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  async findUserByName(name: string): Promise<User | null> {
    return this.userRepository.findUserByName(name);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email); // Adjust for your ORM or database logic
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

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or user not found.');
    }

    if (!(await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid password.');
    }

    return this.generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      type: user.type,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or user not found.');
    }

    if (!(await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid password.');
    }

    return user;
  }

  async getUserInfoByName(name: string): Promise<any> {
    const user = await this.findUserByName(name);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const { password, ...userDetails } = user.toObject();
    return userDetails;
  }
}
