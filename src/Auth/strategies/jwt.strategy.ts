import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }
  async validate(payload: { id: string }) {
    const user = await this.userModel.findById(payload.id).exec();

    if (!user) {
      throw new UnauthorizedException(
        'Unauthorized: Please log in to access this endpoint.',
      );
    }
    if (user.blocked) {
      throw new UnauthorizedException(
        'Unauthorized: Your account has been blocked.',
      );
    }

    return user;
  }
}