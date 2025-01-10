import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard'; // Import the WebSocket JWT guard
import { ChatService } from './chat.service'; // Import ChatService to handle message logic
import { AuthService } from '../auth/auth.service'; // Import AuthService to fetch user info
import { MessageDto } from './message.dto'; // Import MessageDto

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins (update this in production)
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  // Handle new WebSocket connections
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connectionSuccess', { message: 'Connected to WebSocket server' });
  }

  // Handle WebSocket disconnections
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Secure WebSocket endpoint with JWT authentication
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() messageDto: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user; // Get the authenticated user from the WebSocket client
    this.logger.log(`Received message from ${user.name}: ${messageDto.content}`);

    // Save the message using the ChatService
    const savedMessage = await this.chatService.sendMessage({
      ...messageDto,
      sender: user._id.toString(), // Use the authenticated user's ID as the sender
    });

    // Broadcast the message to the receiver
    this.server.to(messageDto.receiver).emit('receiveMessage', savedMessage);

    return { event: 'messageSent', data: savedMessage };
  }

  // Handle joining a room (e.g., for private messaging)
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user; // Get the authenticated user from the WebSocket client
    client.join(room);
    this.logger.log(`User ${user.name} joined room: ${room}`);
    return { event: 'joinedRoom', data: `Joined room: ${room}` };
  }
}