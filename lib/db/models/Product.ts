import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  category: 'panel' | 'inverter' | 'battery' | 'structure' | 'complete_system' | 'other';
  capacityKw?: number;
  price: number;
  description?: string;
  active: boolean;
  specs?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['panel', 'inverter', 'battery', 'structure', 'complete_system', 'other'],
      required: true,
    },
    capacityKw: Number,
    price: { type: Number, required: true },
    description: String,
    active: { type: Boolean, default: true },
    specs: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

// Sample products for TOPAK and other solar solutions
export const SAMPLE_PRODUCTS = [
  {
    sku: 'PANEL-TOPAK-200',
    name: 'TOPAK 200W Solar Panel',
    category: 'panel',
    capacityKw: 0.2,
    price: 4500,
    description: 'High-efficiency monocrystalline solar panel, 200W capacity',
    specs: { efficiency: '18-20%', type: 'monocrystalline', warranty: '25 years' },
  },
  {
    sku: 'INV-5KW',
    name: '5KW Solar Inverter',
    category: 'inverter',
    capacityKw: 5,
    price: 45000,
    description: 'Hybrid solar inverter with battery backup',
    specs: { type: 'hybrid', batteryCompatible: true, warranty: '10 years' },
  },
  {
    sku: 'BATT-LITHIUM-10',
    name: '10KWh Lithium Battery',
    category: 'battery',
    capacityKw: 10,
    price: 150000,
    description: 'Lithium-ion battery storage system',
    specs: { type: 'lithium-ion', cycles: 6000, warranty: '10 years' },
  },
  {
    sku: 'SYSTEM-10KW',
    name: '10KW Complete Solar System',
    category: 'complete_system',
    capacityKw: 10,
    price: 500000,
    description: 'Complete 10KW solar system with panels, inverter, and mounting',
    specs: { includes: 'panels,inverter,structure,wiring' },
  },
];
