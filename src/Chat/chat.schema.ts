import { Schema, Document } from 'mongoose';

export const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  lastUpdated: { type: Date, default: Date.now },
});

export interface Chat extends Document {
  participants: string[];
  messages: string[];
  lastMessage: string;
  lastUpdated: Date;
}