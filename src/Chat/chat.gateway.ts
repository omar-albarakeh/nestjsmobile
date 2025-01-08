import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { sender: string; receiver: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sender, receiver, content } = data;

    this.server.to(receiver).emit('receiveMessage', { sender, content });
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
  }
}