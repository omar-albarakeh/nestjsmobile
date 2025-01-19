import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
): Promise<any> {
  return await this.messageRepository.createMessage(senderId, receiverId, content);
}

async getChatHistory(
  userId1: string,
  userId2: string,
): Promise<any[]> {
  return await this.messageRepository.getMessagesBetweenUsers(userId1, userId2);
}


  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await this.messageRepository.markMessagesAsRead(senderId, receiverId);
  }
}