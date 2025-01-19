import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { CommunityController } from '../Community/community.controller';
import { AuthService } from './auth.service';
import { CommunityService } from '../Community/community.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './user.repository';
import { CommunityRepository } from '../Community/CommunityRepository';
import { User, UserSchema } from './schemas/user.schema';
import { CommunityPost, CommunityPostSchema } from '../Community/Schemas/Community.posts';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') || '1h' },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: CommunityPost.name, schema: CommunityPostSchema },
    ]),
  ],
  controllers: [AuthController, CommunityController],
  providers: [AuthService, CommunityService, JwtStrategy, UserRepository, CommunityRepository],
  exports: [AuthService, JwtModule, PassportModule, UserRepository, CommunityRepository],
})
export class AuthModule {}