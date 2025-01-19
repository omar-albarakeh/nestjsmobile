import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './market-api/items/items.module';
import { envValidationSchema } from './config/env.validation';
import { MessagesModule } from './chatapp/messages.module';

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
    ItemsModule,
    MessagesModule,
  ],
})
export class AppModule {}