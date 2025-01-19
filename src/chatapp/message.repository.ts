import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';

@Injectable()
export class MessageRepository {
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {}

  async createMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const message = new this.messageModel({ sender: senderId, receiver: receiverId, content });
    return await message.save();
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return await this.messageModel
      .find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await this.messageModel.updateMany(
      { sender: senderId, receiver: receiverId, read: false },
      { $set: { read: true } },
    );
  }
}
