import mongoose, { Schema, Document } from 'mongoose';

export interface IStage extends Document {
  name: string;
  order: number;
  isClosedStage: boolean;
  isWonStage: boolean;
  colorCode: string;
  description?: string;
}

const stageSchema = new Schema<IStage>({
  name: { type: String, required: true, unique: true },
  order: { type: Number, required: true, index: true },
  isClosedStage: { type: Boolean, default: false },
  isWonStage: { type: Boolean, default: false },
  colorCode: { type: String, default: '#3B82F6' },
  description: String,
});

export const Stage = mongoose.models.Stage || mongoose.model<IStage>('Stage', stageSchema);

// Default stages for solar CRM
export const DEFAULT_STAGES = [
  { name: 'New Lead', order: 1, isClosedStage: false, isWonStage: false, colorCode: '#3B82F6' },
  { name: 'Contacted', order: 2, isClosedStage: false, isWonStage: false, colorCode: '#8B5CF6' },
  { name: 'Qualified', order: 3, isClosedStage: false, isWonStage: false, colorCode: '#EC4899' },
  { name: 'Site Survey', order: 4, isClosedStage: false, isWonStage: false, colorCode: '#F59E0B' },
  { name: 'Proposal Sent', order: 5, isClosedStage: false, isWonStage: false, colorCode: '#10B981' },
  { name: 'Negotiation', order: 6, isClosedStage: false, isWonStage: false, colorCode: '#06B6D4' },
  { name: 'Closed Won', order: 7, isClosedStage: true, isWonStage: true, colorCode: '#22C55E' },
  { name: 'Closed Lost', order: 8, isClosedStage: true, isWonStage: false, colorCode: '#EF4444' },
];
