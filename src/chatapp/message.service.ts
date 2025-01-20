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
    try {
      return await this.messageRepository.createMessage(senderId, receiverId, content);
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async getChatHistory(
    userId1: string,
    userId2: string,
  ): Promise<any[]> {
    try {
      return await this.messageRepository.getMessagesBetweenUsers(userId1, userId2);
    } catch (error) {
      throw new Error(`Failed to fetch chat history: ${error.message}`);
    }
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    try {
      await this.messageRepository.markMessagesAsRead(senderId, receiverId);
    } catch (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }
}