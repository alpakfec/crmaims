import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Lead, Interaction } from '@/lib/db';
import { requireAuth } from '@/lib/auth/utils';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();

    const { id } = await params;

    const lead = await Lead.findById(id)
      .populate('pipelineStageId')
      .populate('assignedTo', 'name email')
      .populate('productsInterested.productId');

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    // Get interactions
    const interactions = await Interaction.find({ leadId: id })
      .populate('performedBy', 'name email')
      .sort({ timestamp: -1 });

    return NextResponse.json({
      success: true,
      data: {
        lead,
        interactions,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const lead = await Lead.findByIdAndUpdate(id, body, { new: true })
      .populate('pipelineStageId')
      .populate('assignedTo', 'name email');

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();

    const { id } = await params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
