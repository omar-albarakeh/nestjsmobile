import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './market-api/items/items.module';
import { envValidationSchema } from './config/env.validation';
import { CartModule } from './market-api/cart/cartmodule';
import { MessagesModule } from './chatapp/messages.module'; // Import the MessagesModule

@Module({
  imports: [
    // ConfigModule for environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration global
      envFilePath: '.env', // Path to your .env file
      validationSchema: envValidationSchema, // Validation schema for environment variables
      validationOptions: {
        allowUnknown: true, // Allow unknown environment variables
        abortEarly: false, // Collect all validation errors instead of stopping at the first one
      },
    }),

    // MongooseModule for MongoDB connection
    MongooseModule.forRoot(process.env.DB_URI, {
      retryAttempts: 5, // Number of retry attempts to connect to the database
      retryDelay: 1000, // Delay between retry attempts (in milliseconds)
    }),

    // Feature modules
    AuthModule, // Authentication module
    ItemsModule, // Items module (market functionality)
    CartModule, // Cart module
    MessagesModule, // Messages module (chat functionality)
  ],
})
export class AppModule {}