export class MessageDto {
  sender: string; // Sender's user ID (will be populated by the WebSocket gateway)
  receiver: string; // Receiver's user ID
  content: string; // Message content
}