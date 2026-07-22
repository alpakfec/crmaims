import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  platform: 'facebook' | 'google' | 'website_organic' | 'other';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  leadsGenerated?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkflowRule extends Document {
  name: string;
  trigger: 'stage_change' | 'no_contact_for_days' | 'lead_created' | 'deal_won';
  conditions: Record<string, any>;
  actions: Array<{
    type: 'send_whatsapp_template' | 'create_task' | 'notify_user' | 'change_stage';
    config: Record<string, any>;
  }>;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    platform: {
      type: String,
      enum: ['facebook', 'google', 'website_organic', 'other'],
      required: true,
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: Date,
    budget: Number,
    leadsGenerated: { type: Number, default: 0 },
    description: String,
  },
  { timestamps: true }
);

const workflowRuleSchema = new Schema<IWorkflowRule>(
  {
    name: { type: String, required: true },
    trigger: {
      type: String,
      enum: ['stage_change', 'no_contact_for_days', 'lead_created', 'deal_won'],
      required: true,
    },
    conditions: { type: Schema.Types.Mixed, required: true },
    actions: [
      {
        type: {
          type: String,
          enum: ['send_whatsapp_template', 'create_task', 'notify_user', 'change_stage'],
        },
        config: Schema.Types.Mixed,
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Campaign =
  mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', campaignSchema);

export const WorkflowRule =
  mongoose.models.WorkflowRule || mongoose.model<IWorkflowRule>('WorkflowRule', workflowRuleSchema);
