import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesGateway } from './messages.gateway';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { Message, MessageSchema } from './message.schema';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AuthModule,
  ],
  providers: [MessagesGateway, MessageService, MessageRepository],
})
export class MessagesModule {}