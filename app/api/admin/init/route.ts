import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Stage, Product, DEFAULT_STAGES, SAMPLE_PRODUCTS } from '@/lib/db';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Initialize stages
    const existingStages = await Stage.countDocuments();
    if (existingStages === 0) {
      await Stage.insertMany(DEFAULT_STAGES);
      console.log('Stages initialized');
    }

    // Initialize products
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(SAMPLE_PRODUCTS);
      console.log('Products initialized');
    }

    // Initialize default admin user
    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      const hashedPassword = await bcryptjs.hash('admin@123', 10);
      const adminUser = await User.create({
        name: 'Admin',
        email: 'admin@famnshine.com',
        passwordHash: hashedPassword,
        role: 'admin',
        active: true,
        phone: '+1234567890',
      });
      console.log('Admin user created:', adminUser.email);
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
