import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { MessageDto } from './message.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(@Body(new ValidationPipe()) messageDto: MessageDto) {
    return this.chatService.sendMessage(messageDto);
  }

  @Get('messages/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getMessages(@Param('userId') userId: string) {
    return this.chatService.getMessages(userId);
  }

  @Get('chats')
  @UseGuards(AuthGuard('jwt'))
  async getChats() {
    return this.chatService.getChats();
  }
}