import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Lead, WAConversation, WAMessage, Interaction, Stage, User, DEFAULT_STAGES } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bcryptjs from 'bcryptjs';

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'test-verify-token';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Webhook verification (GET)
export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// Handle incoming messages (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify signature
    const signature = request.headers.get('x-hub-signature-256') || '';

    // Process webhook
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const messageData = change.value;

            // Handle messages
            if (messageData.messages && messageData.messages.length > 0) {
              for (const message of messageData.messages) {
                await handleIncomingMessage(message, messageData);
              }
            }

            // Handle status updates
            if (messageData.statuses && messageData.statuses.length > 0) {
              for (const status of messageData.statuses) {
                await handleStatusUpdate(status);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleIncomingMessage(message: any, metadata: any) {
  try {
    await connectDB();

    const contactPhone = message.from;
    const messageText = message.text?.body || '';
    const messageId = message.id;
    const timestamp = new Date(parseInt(message.timestamp) * 1000);

    // Find or create conversation
    let conversation = await WAConversation.findOne({
      waContactPhone: contactPhone,
    });

    let lead;
    if (conversation) {
      lead = await Lead.findById(conversation.leadId);
    } else {
      // Ensure required CRM defaults exist before creating a lead.
      let stage = await Stage.findOne({ name: 'New Lead' });
      if (!stage) {
        stage = await Stage.create({ ...DEFAULT_STAGES[0], order: 1 });
      }

      let user = await User.findOne({ role: 'admin' });
      if (!user) {
        const hashedPassword = await bcryptjs.hash('admin@123', 10);
        user = await User.create({
          name: 'Admin',
          email: 'admin@famnshine.com',
          passwordHash: hashedPassword,
          role: 'admin',
          active: true,
          phone: '+1234567890',
        });
      }

      // Find lead by phone number
      lead = await Lead.findOne({ phone: contactPhone });
      if (!lead) {
        // Create new lead from WhatsApp contact
        lead = await Lead.create({
          leadNumber: Math.floor(Math.random() * 100000),
          name: `WhatsApp ${contactPhone}`,
          phone: contactPhone,
          source: 'whatsapp',
          pipelineStageId: stage._id,
          assignedTo: user._id,
          whatsappOptIn: true,
        });
      }

      conversation = await WAConversation.create({
        leadId: lead._id,
        waPhoneId: metadata?.phone_number_id || contactPhone || 'unknown',
        waContactPhone: contactPhone,
        status: 'open',
      });
    }

    // Generate AI response using Gemini
    let aiResponse = '';
    let aiConfidenceScore = 0;

    if (GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are a friendly customer service assistant for FAMNShine Co., a solar energy company (https://famnshine.com). 
      
A customer has sent the following message: "${messageText}"

Please provide a helpful, concise response (max 2-3 sentences) that:
1. Addresses their query about solar products/services
2. Is friendly and professional
3. If they're inquiring about solar systems, mention we offer complete solutions
4. If appropriate, suggest they can discuss specific products/pricing

Response:`;

      const result = await model.generateContent(prompt);
      aiResponse = result.response.text();
      aiConfidenceScore = 0.8; // Default confidence
    }

    // Save incoming message
    await WAMessage.create({
      conversationId: conversation._id,
      leadId: lead._id,
      direction: 'in',
      content: messageText,
      waMessageId: messageId,
      messageType: 'text',
      status: 'delivered',
      senderType: 'customer',
      timestamp,
    });

    // Create interaction record
    await Interaction.create({
      leadId: lead._id,
      type: 'whatsapp',
      direction: 'inbound',
      summary: messageText,
      performedBy: (await Lead.findById(lead._id)).assignedTo,
      timestamp,
    });

    // Save AI response
    if (aiResponse) {
      await WAMessage.create({
        conversationId: conversation._id,
        leadId: lead._id,
        direction: 'out',
        content: aiResponse,
        messageType: 'text',
        status: 'sent',
        aiGenerated: true,
        aiConfidenceScore,
        geminiContext: `Prompt: ${prompt}`,
        senderType: 'ai',
        timestamp: new Date(),
      });
    }

    // Update conversation
    await WAConversation.updateOne(
      { _id: conversation._id },
      {
        lastMessageAt: timestamp,
        $inc: { messageCount: 1 },
      }
    );

    // Update lead last contact
    await Lead.updateOne(
      { _id: lead._id },
      { lastContactAt: timestamp, whatsappOptIn: true }
    );
  } catch (error: any) {
    console.error('Error handling incoming message:', error);
  }
}

async function handleStatusUpdate(status: any) {
  try {
    await connectDB();

    const messageId = status.id;
    const statusValue = status.status;

    await WAMessage.updateOne(
      { waMessageId: messageId },
      { status: statusValue }
    );
  } catch (error: any) {
    console.error('Error handling status update:', error);
  }
}
