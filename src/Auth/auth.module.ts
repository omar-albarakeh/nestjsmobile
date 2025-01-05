import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    // Passport Module with 'jwt' as the default strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // JWT Module for token management, configured asynchronously using `jwtConfig`
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),

    // Mongoose setup for the User schema
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController], // Auth controller to handle authentication routes
  providers: [
    AuthService,          // Business logic for authentication
    JwtStrategy,          // JWT validation strategy
    UserRepository,       // User data access layer
  ],
  exports: [
    JwtStrategy,          // Exported for use in other modules (e.g., guards)
    PassportModule,       // Ensures `PassportModule` is reusable in other modules
    UserRepository,       // Export the UserRepository for use elsewhere
  ],
})
export class AuthModule {}
