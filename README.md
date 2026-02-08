# KAIRO - India's Civic Action Platform

**Converting Citizen Awareness into Real Government Action**

KAIRO is a production-grade civic technology platform that bridges citizens and government accountability through:
- Legal awareness via AI assistant
- Community-driven issue reporting
- Structured petition creation
- Direct authority communication
- Verified resolution tracking

---

## 🏗️ Architecture Overview

### Core Modules

1. **Identity Module** - Firebase OTP authentication + Supabase user management
2. **AI Rights Assistant** - Groq AI-powered legal guidance in regional languages
3. **City Intelligence Dashboard** - Map-based civic issue tracking
4. **Petition Creation Engine** - AI-assisted drafting with multilingual support
5. **Evidence System** - Image/video/document verification
6. **Authority Action System** - Direct email routing to decision-makers
7. **Resolution Tracking** - Public outcome monitoring and impact metrics

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand (state management)
- React Hook Form + Zod

**Backend:**
- Supabase (PostgreSQL database)
- Firebase Authentication (OTP)
- Groq API (llama-3.3-70b-versatile model for petition generation, legal guidance)

**Infrastructure:**
- Vercel (deployment)
- Firebase Storage (media)
- Supabase Storage (documents)

## 📦 Installation Guide

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Supabase account
- Groq account (for AI API)

### Step 1: Clone and Install

```bash
cd MyKairo
npm install
```

### Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Authentication** → **Phone** provider
4. Get your Firebase config from Project Settings
5. Enable **Storage** for file uploads

### Step 3: Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to SQL Editor and run the schema from `supabase-schema.sql`
4. Get your project URL and anon key from Settings → API

### Step 4: Get AI API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Create an API key for llama-3.3-70b-versatile model
3. Save it securely

### Step 5: Configure Environment

Create `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
GROQ_API_KEY=your_groq_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KAIRO
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 7: Build for Production

```bash
npm run build
npm run start
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

```bash
vercel --prod
```

### Database Migrations

Run Supabase migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

---

## 📱 User Journey

```
1. OTP Login → Profile Setup
2. Choose City & Language
3. Use AI Rights Assistant (optional)
4. View City Issues Map
5. Create Petition (AI-assisted)
6. Collect Signatures
7. Send to Authority via Email
8. Track Response & Resolution
9. Mark as Resolved
```

---

## 🔑 Key Features

### AI Rights Assistant
- Natural language queries in 11 Indian languages
- Cites specific laws, IPC sections, constitutional articles
- Provides actionable steps and authority contact info
- Integrated with petition creation

### Petition Engine
- **AI Mode**: Answer questions → AI generates formal petition
- **Manual Mode**: Write yourself with formatting help
- Multilingual support (auto-translation coming)
- Evidence upload (images, videos, documents)
- Location tagging

### Authority Action System
- AI suggests correct authority based on category + location
- Auto-generates professional email with petition content
- Opens user's email client (mailto:) for personal sending
- Tracks sent status and responses

### City Intelligence Dashboard
- Map view of all local issues
- Filter by category
- Upvote/verify issues
- Create petitions from issues
- See active petitions nearby

### Verification System
- Phone OTP verification (active)
- DigiLocker integration (planned)
- Signature verification
- Trust score system

---

## 🗺️ Folder Structure

```
MyKairo/
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── page.tsx             # Landing page
│   │   ├── auth/login/          # Authentication
│   │   └── dashboard/           # Main app
│   │       ├── page.tsx         # Dashboard home
│   │       ├── ai-assistant/    # AI Rights module
│   │       ├── create-petition/ # Petition creation
│   │       ├── petitions/       # My petitions
│   │       ├── city-map/        # City issues map
│   │       └── community/       # Browse petitions
│   ├── components/
│   │   └── ui/                  # shadcn components
│   ├── lib/
│   │   ├── firebase.ts          # Firebase config
│   │   ├── supabase.ts          # Supabase client
│   │   ├── ai.ts                # AI functions
│   │   └── utils.ts             # Helpers
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth hook
│   │   └── usePetitions.ts      # Petitions hook
│   ├── store/
│   │   ├── authStore.ts         # Auth state
│   │   └── petitionStore.ts     # Petition state
│   └── types/
│       └── index.ts             # TypeScript types
├── public/
├── supabase-schema.sql          # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🔐 Security Considerations

1. **Row Level Security (RLS)** enabled on all Supabase tables
2. **Firebase Auth** for verified phone numbers
3. **Environment variables** for sensitive keys
4. **Signature verification** to prevent fake signatures
5. **Rate limiting** on AI API calls (implement in production)
6. **CORS configuration** for API routes

---

## 🌍 Internationalization

Supported languages:
- English (en)
- हिंदी (hi)
- தமிழ் (ta)
- తెలుగు (te)
- বাংলা (bn)
- मराठी (mr)
- ગુજરાતી (gu)
- ಕನ್ನಡ (kn)
- മലയാളം (ml)
- ਪੰਜਾਬੀ (pa)
- ଓଡ଼ିଆ (or)

AI responses and petition generation work in all languages.

---

## 📊 Database Schema

### Core Tables:
- `users` - Verified citizens
- `petitions` - Civic petitions
- `signatures` - Verified signatures
- `civic_issues` - Community reports
- `authorities` - Government contacts 
- `petition_updates` - Progress tracking
- `evidence` - Uploaded files
- `ai_queries` - Rights assistant history
- `notifications` - User alerts

See `supabase-schema.sql` for full schema with indexes, triggers, and RLS policies.

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

# Database
supabase db reset        # Reset local database
supabase db push         # Push migrations
supabase gen types typescript --local > src/types/database.ts

# Deployment
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
```

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core authentication
- ✅ AI Rights Assistant
- ✅ Petition creation & signatures
- ✅ Authority suggestion system
- ✅ Basic dashboard

### Phase 2 (Next 2 months)
- 🔄 City Intelligence Map (Leaflet integration)
- 🔄 Community feed & discovery
- 🔄 Push notifications
- 🔄 WhatsApp integration for updates
- 🔄 Authority database (2000+ contacts)

### Phase 3 (Future)
- 📋 DigiLocker verification
- 📋 Aadhaar integration
- 📋 Auto-translation for all languages
- 📋 Mobile app (React Native)
- 📋 Analytics dashboard
- 📋 Success stories & impact metrics

---

## 📞 Support & Contact

**Built for India's Civic Future**

For issues, feature requests, or contributions:
- Create an issue on GitHub
- Email: team@kairo.in (if applicable)

---

## 📄 License

This project is built as a civic technology platform for public good.

---

## 🙏 Acknowledgments

- Firebase for authentication infrastructure
- Supabase for database and storage
- Groq for AI capabilities (llama-3.3-70b-versatile)
- shadcn/ui for beautiful components
- The civic tech community in India

---

**KAIRO - Because every citizen voice matters. 🇮🇳**
