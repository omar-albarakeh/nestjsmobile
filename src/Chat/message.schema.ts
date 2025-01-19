// import { Schema, Document } from 'mongoose';

// export const MessageSchema = new Schema({
//   sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   read: { type: Boolean, default: false },
// });

// export interface Message extends Document {
//   sender: string;
//   receiver: string;
//   content: string;
//   timestamp: Date;
//   read: boolean;
// }

// export type MessageDocument = Message & Document;