// src/gateways/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  @UseGuards(AuthGuard('jwt'))
  async handleMessage(
    @MessageBody() data: { sender: string; receiver: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sender, receiver, content } = data;

    // Save message to database (you can call ChatService here)
    // Broadcast the message to the receiver
    this.server.to(receiver).emit('receiveMessage', { sender, content });
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
  }
}