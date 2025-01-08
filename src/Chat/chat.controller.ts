// src/controllers/chat.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { AuthGuard } from '@nestjs/passport';
import { MessageDto } from '../dto/message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(@Body() messageDto: MessageDto) {
    return this.chatService.sendMessage(messageDto);
  }

}