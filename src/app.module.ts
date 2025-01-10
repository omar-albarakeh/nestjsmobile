import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    // Configure environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration global
      envFilePath: '.env', // Load environment variables from .env file
      validationSchema: envValidationSchema, // Validate environment variables
      validationOptions: {
        allowUnknown: true, // Allow unknown environment variables
        abortEarly: false, // Report all validation errors at once
      },
    }),

    // Configure MongoDB connection
    MongooseModule.forRoot(process.env.DB_URI, {
      retryAttempts: 5, // Retry connection up to 5 times
      retryDelay: 1000, // Delay between retries (1 second)
    }),

    // Feature modules
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}