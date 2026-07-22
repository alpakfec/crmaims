import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  leadId: Types.ObjectId;
  assignedTo: Types.ObjectId;
  type: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: 'pending' | 'done' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  createdBy: Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'done', 'overdue'],
      required: true,
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    completedAt: Date,
  },
  { timestamps: true }
);

// Indexes for daily task queries
taskSchema.index({ assignedTo: 1, dueDate: 1, status: 1 });

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);
