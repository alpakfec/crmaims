import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInteraction extends Document {
  leadId: Types.ObjectId;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note';
  direction?: 'inbound' | 'outbound';
  summary: string;
  performedBy: Types.ObjectId;
  timestamp: Date;
  outcome?: string;
  nextFollowUpAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const interactionSchema = new Schema<IInteraction>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    type: {
      type: String,
      enum: ['call', 'whatsapp', 'email', 'meeting', 'note'],
      required: true,
    },
    direction: { type: String, enum: ['inbound', 'outbound'] },
    summary: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    outcome: String,
    nextFollowUpAt: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes
interactionSchema.index({ leadId: 1, timestamp: -1 });

export const Interaction =
  mongoose.models.Interaction || mongoose.model<IInteraction>('Interaction', interactionSchema);
