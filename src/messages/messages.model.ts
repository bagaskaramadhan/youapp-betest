import mongoose from 'mongoose';

export const MessagesSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'cUsers' },
  received: { type: mongoose.Schema.Types.ObjectId, ref: 'cUsers' },
  content: String,
  timestamp: { type: Date, default: Date.now() },
});

export class Messages {
  constructor(
    readonly sender: string,
    readonly received: string,
    readonly content: string,
    readonly timestamp: Date,
  ) {}
}
