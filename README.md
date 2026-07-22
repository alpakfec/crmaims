# FAMNShine CRM - Solar Business Management System

A comprehensive, production-ready CRM application built with **Next.js**, **MongoDB**, **NextAuth**, and **Google Gemini AI** for managing solar business leads, sales pipelines, and WhatsApp customer interactions.

## 🌟 Features

### Core CRM
- ✅ **Lead Management**: Store and organize prospect details with unified contact database
- ✅ **Sales Pipeline**: Visual pipeline management with customizable stages (New Lead → Closed Won/Lost)
- ✅ **Lead Scoring & Routing**: Automatic lead assignment based on territory and availability
- ✅ **Contact History**: Complete activity log with calls, emails, meetings, notes, and WhatsApp interactions
- ✅ **Product Tracking**: Track customer interest in specific solar products with quantities
- ✅ **Deal Management**: Separate deal records with payment schedules and deposit tracking

### Advanced Features
- ✅ **WhatsApp Business Integration**: Receive and respond to customer messages
- ✅ **AI-Powered Responses**: Google Gemini API automatically drafts contextual responses
- ✅ **Workflow Automation**: Trigger actions on stage changes, inactivity, or deal wins
- ✅ **Task Management**: Follow-up reminders and automation workflows
- ✅ **Analytics & Reporting**: Dashboard with key metrics, pipeline visualization, conversion rates
- ✅ **Role-Based Access**: Admin, Manager, and Sales Rep roles with appropriate permissions

### Technical Stack
- **Frontend**: Next.js 16 + React 19 + Tailwind CSS
- **Backend**: Node.js with Next.js API routes
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: NextAuth.js with credentials provider
- **AI**: Google Generative AI (Gemini)
- **WhatsApp**: Official WhatsApp Business API webhook integration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key (optional)
- WhatsApp Business Account (optional)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure environment
# Edit .env.local with your credentials

# Start development server
npm run dev
```

### Initialize Database

```bash
curl -X POST http://localhost:3000/api/admin/init \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json"
```

### Login
- **Email**: admin@famnshine.com
- **Password**: admin@123

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Database Collections

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| users | Sales team & auth | name, email, role, territory |
| leads | Prospects/customers | name, phone, source, pipelineStageId, assignedTo |
| stages | Pipeline stages | name, order, isClosedStage, colorCode |
| products | Solar products catalog | sku, name, category, price, capacityKw |
| deals | Commercial terms | leadId, products[], dealValue, paymentSchedule |
| interactions | Activity log | leadId, type, summary, timestamp |
| tasks | Follow-up reminders | leadId, assignedTo, dueDate, status |
| wa_conversations | WhatsApp chats | leadId, waContactPhone, status |
| wa_messages | WhatsApp messages | conversationId, content, aiGenerated, aiConfidenceScore |
| campaigns | Lead sources | name, platform, leadsGenerated |
| workflow_rules | Automation triggers | trigger, conditions, actions |

---

## 🔌 API Reference

### Leads
```
GET    /api/leads                    # List leads (pagination, filters)
POST   /api/leads                    # Create new lead
GET    /api/leads/[id]              # Get lead + interactions
PUT    /api/leads/[id]              # Update lead
DELETE /api/leads/[id]              # Delete lead
```

### Tasks
```
GET    /api/tasks                    # List tasks for user
POST   /api/tasks                    # Create task
```

### WhatsApp
```
GET    /api/whatsapp/webhook        # Webhook verification
POST   /api/whatsapp/webhook        # Handle incoming messages
```

### Admin
```
POST   /api/admin/init              # Initialize database
```

---

## 🤖 WhatsApp + Gemini Setup

1. **Get WhatsApp Credentials**
   - Create app at https://developers.facebook.com/
   - Get Phone ID, Account ID, Access Token

2. **Configure Webhook**
   ```
   URL: https://yourdomain.com/api/whatsapp/webhook
   Verify Token: your-webhook-verify-token
   ```

3. **Get Gemini API Key**
   - Go to https://ai.google.dev/
   - Create and copy API key

4. **Update .env.local**
   ```env
   WHATSAPP_BUSINESS_PHONE_ID=...
   WHATSAPP_BUSINESS_ACCESS_TOKEN=...
   NEXT_PUBLIC_GEMINI_API_KEY=...
   ```

---

## 📁 Project Structure

```
crmaims/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── admin/init/
│   │   ├── leads/
│   │   ├── tasks/
│   │   └── whatsapp/webhook/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── leads/
│   │   ├── pipeline/
│   │   ├── tasks/
│   │   ├── whatsapp/
│   │   ├── reports/
│   │   └── settings/
│   ├── login/page.tsx
│   └── providers.tsx
├── lib/
│   ├── db/
│   │   ├── connection.ts
│   │   ├── models/
│   │   └── index.ts
│   └── auth/
│       ├── config.ts
│       └── utils.ts
└── components/
    ├── Sidebar.tsx
    └── Header.tsx
```

---

## 🔐 Security

- All API routes require authentication
- WhatsApp webhook signature verification
- Environment variables for secrets
- MongoDB indexes for query optimization
- Rate limiting on webhook endpoints
- HTTPS required for production

---

## 🎯 Default Pipeline

1. **New Lead** - Auto-assigned on creation
2. **Contacted** - Initial outreach
3. **Qualified** - Meets criteria
4. **Site Survey** - Location assessment
5. **Proposal Sent** - Quote delivered
6. **Negotiation** - Terms discussion
7. **Closed Won** - Deal closed
8. **Closed Lost** - Deal lost

---

## 📦 Built With

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Google Generative AI](https://ai.google.dev/) - Gemini API
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📝 Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/famnshine_crm

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key

# WhatsApp
WHATSAPP_BUSINESS_PHONE_ID=your-phone-id
WHATSAPP_BUSINESS_ACCOUNT_ID=your-account-id
WHATSAPP_BUSINESS_ACCESS_TOKEN=your-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-verify-token

# Application
NEXT_PUBLIC_APP_NAME=FAMNShine CRM
NEXT_PUBLIC_COMPANY_URL=https://famnshine.com
NODE_ENV=development
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Railway / Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy

---

## 📞 Support

- Review `.env.local` configuration
- Check MongoDB connection
- Verify API keys are valid
- Review application logs

---

Built with ❤️ for FAMNShine Solar Co.
