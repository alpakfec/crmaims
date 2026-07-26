import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILead extends Document {
  leadNumber: number;
  name: string;
  source: 'facebook' | 'whatsapp' | 'website' | 'google_ads' | 'referral' | 'walk_in' | 'other';
  campaignId?: Types.ObjectId;
  phone: string;
  altPhone?: string;
  email?: string;
  city?: string;
  address?: string;
  pipelineStageId: Types.ObjectId;
  status: 'open' | 'closed_won' | 'closed_lost';
  lostReason?: string;
  assignedTo: Types.ObjectId;
  leadScore?: number;
  productsInterested?: Array<{ productId: Types.ObjectId; qty: number }>;
  winProbability?: number;
  whatsappOptIn: boolean;
  firstContactAt: Date;
  lastContactAt?: Date;
  isDuplicate?: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    leadNumber: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    source: {
      type: String,
      enum: ['facebook', 'whatsapp', 'website', 'google_ads', 'referral', 'walk_in', 'other'],
      required: true,
    },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    phone: { type: String, required: true },
    altPhone: String,
    email: String,
    city: { type: String },
    address: String,
    pipelineStageId: { type: Schema.Types.ObjectId, ref: 'Stage', required: true },
    status: {
      type: String,
      enum: ['open', 'closed_won', 'closed_lost'],
      required: true,
      default: 'open',
    },
    lostReason: String,
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leadScore: { type: Number, min: 0, max: 100 },
    productsInterested: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        qty: Number,
      },
    ],
    winProbability: { type: Number, min: 0, max: 100 },
    whatsappOptIn: { type: Boolean, required: true, default: false },
    firstContactAt: { type: Date, required: true, default: Date.now },
    lastContactAt: Date,
    isDuplicate: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

// Indexes for performance
leadSchema.index({ assignedTo: 1, pipelineStageId: 1 });
leadSchema.index({ name: 'text' });

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);

export async function getNextLeadNumber(): Promise<number> {
  const lastLead = await Lead.findOne().sort({ leadNumber: -1 }).select('leadNumber');
  return (lastLead?.leadNumber || 0) + 1;
}
