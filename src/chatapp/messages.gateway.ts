// src/messages/gateways/messages.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessagesGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  // Handle WebSocket connection
  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      this.logger.error('No token provided');
      client.disconnect();
      return;
    }

    try {
      // Verify the JWT token
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      client.handshake.auth.userId = payload.id; // Attach userId to the socket
      this.logger.log(`Client connected: ${client.id}, User ID: ${payload.id}`);
    } catch (error) {
      this.logger.error('Invalid token', error.message);
      client.disconnect(); // Disconnect if token is invalid
    }
  }

  // Handle WebSocket disconnection
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Handle sending messages
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { receiverId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.handshake.auth.userId;
    if (!senderId) {
      this.logger.error('Sender ID not found');
      return;
    }

    try {
      // Save the message to the database
      const message = await this.messageService.sendMessage(
        senderId,
        data.receiverId,
        data.content,
      );

      // Emit the message to the receiver
      this.server.to(data.receiverId).emit('receiveMessage', message);
      this.logger.log(`Message sent from ${senderId} to ${data.receiverId}`);
    } catch (error) {
      this.logger.error('Error sending message', error.message);
    }
  }

  // Handle joining a chat room
  @SubscribeMessage('joinChat')
  handleJoinChat(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
    this.logger.log(`User ${userId} joined the chat`);
  }
}