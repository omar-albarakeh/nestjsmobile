import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { Request } from 'express';
import { SendMessageDto } from './message.dto';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/send')
async sendMessage(@Req() req: Request, @Body() sendMessageDto: SendMessageDto) {
  const senderId = req.user['id'];
  try {
    return await this.messageService.sendMessage(senderId, sendMessageDto.receiverId, sendMessageDto.content);
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  @Get('/chat/:userId')
  async getChatHistory(@Req() req: Request, @Param('userId') userId: string) {
    const currentUserId = req.user['id'];
    try {
      return await this.messageService.getChatHistory(currentUserId, userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/mark-read/:userId')
  async markMessagesAsRead(@Req() req: Request, @Param('userId') userId: string) {
    const currentUserId = req.user['id'];
    try {
      await this.messageService.markMessagesAsRead(userId, currentUserId);
      return { status: 'success', message: 'Messages marked as read.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
