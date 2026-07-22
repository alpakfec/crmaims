import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDeal extends Document {
  leadId: Types.ObjectId;
  products: Array<{
    productId: Types.ObjectId;
    qty: number;
    unitPrice: number;
  }>;
  dealValue: number;
  totalValue: number;
  depositPaid?: boolean;
  depositAmount?: number;
  paymentSchedule?: Array<{
    dueDate: Date;
    amount: number;
    description?: string;
    paid?: boolean;
  }>;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'won' | 'lost';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    dealValue: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    depositPaid: { type: Boolean, default: false },
    depositAmount: Number,
    paymentSchedule: [
      {
        dueDate: Date,
        amount: Number,
        description: String,
        paid: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected', 'won', 'lost'],
      required: true,
      default: 'draft',
    },
    notes: String,
  },
  { timestamps: true }
);

export const Deal = mongoose.models.Deal || mongoose.model<IDeal>('Deal', dealSchema);
