// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ChatService } from './chat.service';
// import { ChatGateway } from './chat.gateway';
// import { MessageSchema } from './message.schema';
// import { ChatSchema } from './chat.schema';
// import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use AuthService
// import { JwtModule } from '@nestjs/jwt'; // Import JwtModule to use JwtService
// import { WsJwtGuard } from './ws-jwt.guard'; // Import WsJwtGuard

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: 'Message', schema: MessageSchema },
//       { name: 'Chat', schema: ChatSchema },
//     ]),
//     AuthModule, // Import AuthModule to use AuthService
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   providers: [ChatService, ChatGateway, WsJwtGuard], // Provide WsJwtGuard
// })
// export class ChatModule {}