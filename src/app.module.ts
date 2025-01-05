import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { envValidationSchema } from './config/env.validation';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SolarModule } from './solar/solar.module'; // Adjusted to match the `solar` module name

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    MongooseModule.forRoot(process.env.DB_URI), // Simplified connection options
    AuthModule,
    SolarModule, // Updated to match the correct module name
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    const dbUri = this.configService.get<string>('DB_URI');
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpires = this.configService.get<string>('JWT_EXPIRES');

    console.log('Application Configuration:');
    console.log('DB_URI:', dbUri ? 'Loaded' : 'Missing');
    console.log('JWT_SECRET:', jwtSecret ? 'Loaded' : 'Missing');
    console.log('JWT_EXPIRES:', jwtExpires ? jwtExpires : 'Default: 1h');
  }
}
