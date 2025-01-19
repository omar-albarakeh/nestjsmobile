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
import { SendMessageWsDto } from './message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway {
  @WebSocketServer() server: Server;
  private logger = new Logger('MessagesGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token || client.handshake.headers['authorization'];

    if (!token) {
      this.logger.error('No token provided');
      client.emit('error', { message: 'Authentication token is missing' });
      client.disconnect();
      return;
    }

    try {
      const jwtToken = (Array.isArray(token) ? token[0] : token).replace('Bearer ', '');
      const payload = this.jwtService.verify(jwtToken);

      client.handshake.auth.userId = payload.id;
      this.logger.log(`Client connected: ${client.id}, User ID: ${payload.id}`);

      client.join(payload.id);
      client.emit('connected', { status: 'success', userId: payload.id });
    } catch (error) {
      this.logger.error('Invalid token', error.message);
      client.emit('error', { message: 'Invalid or expired token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: SendMessageWsDto,
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.handshake.auth.userId;

    if (!senderId) {
      this.logger.error('Sender ID not found');
      client.emit('error', { message: 'Unauthorized access' });
      return;
    }

    try {
      const message = await this.messageService.sendMessage(
        senderId,
        data.receiverId,
        data.content,
      );

      this.server.to(data.receiverId).emit('receiveMessage', message);
      client.emit('messageSent', { status: 'success', message });
    } catch (error) {
      this.logger.error('Error sending message', error.message);
      client.emit('error', { message: 'Failed to send the message' });
    }
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const authUserId = client.handshake.auth.userId;
    if (authUserId !== userId) {
      client.emit('error', { message: 'Unauthorized room join attempt' });
      return;
    }

    client.join(userId);
    this.logger.log(`User ${userId} joined the chat room`);
    client.emit('joinedChat', { status: 'success', roomId: userId });
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const authUserId = client.handshake.auth.userId;
    if (authUserId !== userId) {
      client.emit('error', { message: 'Unauthorized room leave attempt' });
      return;
    }

    client.leave(userId);
    this.logger.log(`User ${userId} left the chat room`);
    client.emit('leftChat', { status: 'success', roomId: userId });
  }
}
