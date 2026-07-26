import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWAConversation extends Document {
  leadId: Types.ObjectId;
  waPhoneId: string;
  waContactPhone: string;
  status: 'open' | 'resolved' | 'needs_human';
  assignedTo?: Types.ObjectId;
  lastMessageAt: Date;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWAMessage extends Document {
  conversationId: Types.ObjectId;
  leadId: Types.ObjectId;
  direction: 'in' | 'out';
  content: string;
  waMessageId?: string;
  messageType: 'text' | 'image' | 'template' | 'interactive' | 'document';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  aiGenerated?: boolean;
  aiConfidenceScore?: number;
  geminiContext?: string;
  senderType?: 'customer' | 'support' | 'ai';
  timestamp: Date;
  createdAt: Date;
}

const waConversationSchema = new Schema<IWAConversation>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    waPhoneId: { type: String },
    waContactPhone: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['open', 'resolved', 'needs_human'],
      default: 'open',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    lastMessageAt: { type: Date, required: true, default: Date.now },
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const waMessageSchema = new Schema<IWAMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'WAConversation', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    direction: { type: String, enum: ['in', 'out'], required: true },
    content: { type: String, required: true },
    waMessageId: String,
    messageType: {
      type: String,
      enum: ['text', 'image', 'template', 'interactive', 'document'],
      default: 'text',
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent',
    },
    aiGenerated: { type: Boolean, default: false },
    aiConfidenceScore: Number,
    geminiContext: String,
    senderType: { type: String, enum: ['customer', 'support', 'ai'] },
    timestamp: { type: Date, required: true, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes
waMessageSchema.index({ conversationId: 1, timestamp: -1 });

export const WAConversation =
  mongoose.models.WAConversation || mongoose.model<IWAConversation>('WAConversation', waConversationSchema);

export const WAMessage =
  mongoose.models.WAMessage || mongoose.model<IWAMessage>('WAMessage', waMessageSchema);
