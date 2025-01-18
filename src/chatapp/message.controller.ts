// src/messages/controllers/message.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { Request } from 'express';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/send')
  async sendMessage(
    @Req() req: Request,
    @Body('receiverId') receiverId: string,
    @Body('content') content: string,
  ) {
    const senderId = req.user['id']; // Assuming user ID is stored in the JWT payload
    return await this.messageService.sendMessage(senderId, receiverId, content);
  }

  @Get('/chat/:userId')
  async getChatHistory(
    @Req() req: Request,
    @Param('userId') userId: string,
  ) {
    const currentUserId = req.user['id'];
    return await this.messageService.getChatHistory(currentUserId, userId);
  }

  @Post('/mark-read/:userId')
  async markMessagesAsRead(
    @Req() req: Request,
    @Param('userId') userId: string,
  ) {
    const currentUserId = req.user['id'];
    await this.messageService.markMessagesAsRead(userId, currentUserId);
    return { status: 'success', message: 'Messages marked as read.' };
  }
}