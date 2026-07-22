import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Lead, Stage, User, getNextLeadNumber } from '@/lib/db';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const stageId = searchParams.get('stageId');
    const assignedTo = searchParams.get('assignedTo');
    const search = searchParams.get('search');

    const query: any = {};

    if (status) query.status = status;
    if (stageId) query.pipelineStageId = stageId;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const leads = await Lead.find(query)
      .populate('pipelineStageId')
      .populate('assignedTo', 'name email')
      .populate('productsInterested.productId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await connectDB();

    const body = await request.json();

    // Get default "New Lead" stage
    const newLeadStage = await Stage.findOne({ name: 'New Lead' });
    if (!newLeadStage) {
      return NextResponse.json({ success: false, error: 'Default stage not found' }, { status: 500 });
    }

    const leadNumber = await getNextLeadNumber();

    const lead = await Lead.create({
      leadNumber,
      name: body.name,
      source: body.source || 'website',
      phone: body.phone,
      email: body.email,
      city: body.city,
      address: body.address,
      pipelineStageId: newLeadStage._id,
      assignedTo: body.assignedTo || user.id,
      whatsappOptIn: body.whatsappOptIn || false,
      firstContactAt: new Date(),
      tags: body.tags || [],
    });

    await lead.populate('pipelineStageId').populate('assignedTo', 'name email');

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
