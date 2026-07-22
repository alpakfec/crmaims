import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  role: 'admin' | 'sales_manager' | 'sales_rep';
  territory?: string;
  active: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: String,
    phone: String,
    role: {
      type: String,
      enum: ['admin', 'sales_manager', 'sales_rep'],
      required: true,
      default: 'sales_rep',
    },
    territory: String,
    active: { type: Boolean, required: true, default: true },
    avatarUrl: String,
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
