import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ProductModule } from './market/market.module'; 
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    MongooseModule.forRoot(process.env.DB_URI, {
      retryAttempts: 5,
      retryDelay: 1000,
    }),

    AuthModule,
    ChatModule,
    ProductModule,
  ],
})
export class AppModule {}
