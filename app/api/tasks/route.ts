import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Task } from '@/lib/db';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const assignedTo = searchParams.get('assignedTo') || user.id;
    const status = searchParams.get('status');

    const query: any = { assignedTo };
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('leadId', 'name phone')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await connectDB();

    const body = await request.json();

    const task = await Task.create({
      ...body,
      createdBy: user.id,
    });

    await task.populate('leadId').populate('assignedTo');

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
