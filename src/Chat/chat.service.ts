import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { Chat, ChatDocument } from './chat.schema';
import { MessageDto } from './message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<MessageDocument>,
    @InjectModel('Chat') private readonly chatModel: Model<ChatDocument>,
  ) {}

  async sendMessage(messageDto: MessageDto) {
    const { sender, receiver, content } = messageDto;

    // Validate sender and receiver (e.g., check if they exist in the database)
    // You can add additional validation here

    const message = new this.messageModel({
      sender,
      receiver,
      content,
    });

    await message.save();

    const messageId = message._id.toString();

    let chat = await this.chatModel.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!chat) {
      chat = new this.chatModel({
        participants: [sender, receiver],
        messages: [messageId],
        lastMessage: messageId,
        lastUpdated: new Date(),
      });
    } else {
      chat.messages.push(messageId);
      chat.lastMessage = messageId;
      chat.lastUpdated = new Date();
    }

    await chat.save();

    return message;
  }

  async getMessages(userId: string) {
    const messages = await this.messageModel
      .find({ $or: [{ sender: userId }, { receiver: userId }] })
      .populate('sender receiver')
      .exec();

    if (!messages) {
      throw new NotFoundException('No messages found');
    }

    return messages;
  }

  async getChats() {
    const chats = await this.chatModel
      .find()
      .populate('participants lastMessage')
      .exec();

    if (!chats) {
      throw new NotFoundException('No chats found');
    }

    return chats;
  }
}