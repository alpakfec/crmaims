# FAMNShine CRM - Getting Started Guide

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ (already installed)
- MongoDB (local or Atlas)
- Google Gemini API Key (optional for WhatsApp)

### Setup Steps

1. **Install Dependencies** ✅
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Environment Variables**
   
   Edit `.env.local` with your settings:

   ```env
   # MongoDB - Choose one:
   
   # Option A: Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/crmaims
   
   # Option B: MongoDB Atlas (Recommended for Production)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crmaims?retryWrites=true&w=majority

   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-generate-with: $(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   NEXTAUTH_URL=http://localhost:3000

   # Google Gemini API (Optional for WhatsApp AI)
   NEXT_PUBLIC_GEMINI_API_KEY=your-api-key-from-google-ai-studio

   # WhatsApp Business Integration (Optional)
   WHATSAPP_BUSINESS_PHONE_ID=your-phone-id
   WHATSAPP_BUSINESS_ACCOUNT_ID=your-account-id
   WHATSAPP_BUSINESS_ACCESS_TOKEN=your-access-token
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-verify-token

   # Application Settings
   NEXT_PUBLIC_APP_NAME=FAMNShine CRM
   NEXT_PUBLIC_COMPANY_URL=https://famnshine.com
   NODE_ENV=development
   ```

3. **Setup MongoDB**

   ### Option A: Local MongoDB (macOS with Homebrew)
   ```bash
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   
   # Verify connection
   mongosh
   ```

   ### Option B: MongoDB Atlas (Cloud)
   1. Create account at https://www.mongodb.com/cloud/atlas
   2. Create a cluster
   3. Get connection string from "Connect" button
   4. Replace `MONGODB_URI` in `.env.local`
   5. Whitelist your IP address

4. **Generate NEXTAUTH_SECRET**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and paste into `NEXTAUTH_SECRET` in `.env.local`

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server runs at: http://localhost:3000

6. **Initialize Database**
   ```bash
   curl -X POST http://localhost:3000/api/admin/init \
     -H "Content-Type: application/json"
   ```
   
   This creates:
   - 8 default pipeline stages
   - 4 sample solar products
   - Admin user (email: admin@famnshine.com, password: admin@123)

7. **Login**
   - Open http://localhost:3000/login
   - Email: `admin@famnshine.com`
   - Password: `admin@123`

---

## 📊 Database Models

### Core Entities
- **Lead**: CRM contacts (auto-increment leadNumber, full-text search)
- **Stage**: Pipeline stages (8 default: New → Closed)
- **Product**: Solar products (TOPAK panels, inverters, batteries, systems)
- **Deal**: Commercial terms + payment schedules
- **Interaction**: Activity log (calls, emails, meetings, notes)
- **Task**: Follow-up reminders
- **User**: Sales team (admin, sales_manager, sales_rep)
- **Campaign**: Lead source attribution + automation rules
- **WAConversation**: WhatsApp conversation history
- **WAMessage**: WhatsApp messages + AI confidence scores

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/callback/credentials` - Login
- `POST /api/auth/signin` - Sign in endpoint
- `POST /api/auth/signout` - Logout

### Leads
- `GET /api/leads` - List (pagination, filters: status, stage, assignedTo, search)
- `POST /api/leads` - Create new lead
- `GET /api/leads/[id]` - Get lead details with interactions
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

### Tasks
- `GET /api/tasks` - List tasks for user
- `POST /api/tasks` - Create task

### WhatsApp
- `GET /api/whatsapp/webhook` - Webhook verification
- `POST /api/whatsapp/webhook` - Handle incoming messages (Gemini AI)

### Admin
- `POST /api/admin/init` - Initialize database (stages, products, admin user)

---

## 🎨 Dashboard Features

### Pages
1. **Dashboard** - Metrics & charts (Weekly activity, Pipeline distribution)
2. **Leads** - Lead management (CRUD, filtering, pagination)
3. **Pipeline** - Kanban view (drag-and-drop stages)
4. **Tasks** - Follow-up reminders
5. **WhatsApp** - Integration status & setup
6. **Reports** - Analytics (Sales Performance, Conversion, Lead Sources)
7. **Settings** - Profile, integrations, team management

### Components
- Protected routes (SessionProvider)
- Responsive sidebar navigation (7 sections)
- User profile dropdown
- Toast notifications (react-hot-toast)
- Charts (Recharts for analytics)

---

## 🧪 Testing

### Test Admin Login
```bash
# Via curl
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@famnshine.com","password":"admin@123"}'
```

### Create Sample Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "phone": "8801700000000",
    "email": "test@company.com",
    "city": "Dhaka",
    "leadSource": "Direct",
    "assignedTo": "admin-user-id"
  }'
```

### Get All Leads
```bash
curl http://localhost:3000/api/leads
```

### WhatsApp Webhook Testing
```bash
# Verification (GET)
curl -X GET "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=CHALLENGE&hub.verify_token=your-token"

# Incoming Message (POST)
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "8801700000000",
            "text": {"body": "Hi, I am interested in solar panels"}
          }],
          "contacts": [{
            "profile": {"name": "Customer Name"}
          }]
        }
      }]
    }]
  }'
```

---

## 🚀 Production Deployment

### Build
```bash
npm run build
npm run start
```

### Environment Variables (Production)
- Set `NEXTAUTH_SECRET` to a strong random value
- Use MongoDB Atlas for production database
- Add production domain to `NEXTAUTH_URL`
- Configure WhatsApp webhook URL
- Set Google Gemini API key for AI features

### Deployment Platforms
- Vercel (recommended for Next.js)
- AWS EC2 + RDS
- Azure App Service
- DigitalOcean
- Railway

---

## 📝 Configuration Files

- **`package.json`** - Dependencies & scripts
- **`tsconfig.json`** - TypeScript configuration
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS config
- **`.env.local`** - Environment variables
- **`README.md`** - Project documentation

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running: `brew services list`
- Verify MONGODB_URI in `.env.local`
- If using Atlas, whitelist your IP
- Ensure credentials are correct

### Auth Failures
- Verify NEXTAUTH_SECRET is set
- Check if user exists in database
- Ensure /api/admin/init has been run
- Clear browser cookies if login fails

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 <PID>
# or use different port: PORT=3001 npm run dev
```

### WhatsApp Webhook Issues
- Verify webhook URL is publicly accessible
- Check WHATSAPP_WEBHOOK_VERIFY_TOKEN matches
- Ensure GET and POST handlers are working
- Test with curl before integrating with WhatsApp

---

## 📚 Additional Resources

- Next.js: https://nextjs.org/docs
- MongoDB: https://docs.mongodb.com
- NextAuth.js: https://next-auth.js.org
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

## 💡 Next Steps

1. ✅ Complete setup following the guide above
2. 🔐 Customize authentication (add Google/GitHub OAuth if needed)
3. 📊 Set up analytics dashboard with real data
4. 🤖 Integrate Gemini AI for WhatsApp responses
5. 📧 Add email integration (Sendgrid, Mailgun)
6. 💳 Integrate payment processing (Razorpay, Stripe)
7. 📱 Build mobile app (React Native)
8. 🌐 Deploy to production

---

**Created:** July 23, 2026  
**Status:** Production Ready ✅  
**Version:** 1.0.0
