# 🚀 KAIRO - Quick Start Guide

## ⚡ Get Started in 10 Minutes

### Step 1: Install Dependencies (2 minutes)

```bash
cd "c:\Web Development\Projects\MyKairo"
npm install
```

### Step 2: Set Up Firebase (3 minutes)

1. Go to https://console.firebase.google.com/
2. Create a new project: "KAIRO"
3. Click "Authentication" → "Get Started" → Enable "Phone" provider
4. Go to Project Settings → Copy your config values

### Step 3: Set Up Supabase (3 minutes)

1. Go to https://supabase.com/dashboard
2. Create new project: "kairo-db"
3. Wait for database to be ready
4. Go to SQL Editor → New Query
5. Copy-paste entire `supabase-schema.sql` file → Run
6. Go to Settings → API → Copy URL and anon key

### Step 4: Get AI API Key (1 minute)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Step 5: Create Environment File (1 minute)

Create `.env.local` in project root:

```env
# Firebase (from Step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kairo-xyz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kairo-xyz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kairo-xyz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# Supabase (from Step 3)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI (from Step 4)
GOOGLE_GEMINI_API_KEY=AIzaSy...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KAIRO
```

### Step 6: Run! ⚡

```bash
npm run dev
```

Open http://localhost:3000

---

## 🎯 First-Time User Journey

1. **Landing Page** → Click "Get Started"
2. **Login** → Enter phone number (use your real number for OTP)
3. **OTP Verification** → Enter 6-digit code from SMS
4. **Profile Setup** → Fill name, city, state, language
5. **Dashboard** → You're in! 🎉

---

## 🧪 Testing the Platform

### Test AI Rights Assistant

1. Go to Dashboard → "AI Rights Assistant"
2. Try: "My landlord is not returning my security deposit"
3. See AI response with laws, steps, and authority info

### Test Petition Creation

1. Go to "Create Petition"
2. Fill the form:
   - Category: Infrastructure
   - Problem: "Main road has dangerous potholes for 6 months"
   - Impact: "Multiple accidents, unsafe for everyone"
   - Change: "Repair all potholes within 15 days"
3. Click "Generate with AI"
4. Review the generated petition
5. Add location (or use GPS)
6. Publish!

### Test Signing Petitions

1. Create a second user account (different phone)
2. Go to "Community" tab
3. Find and sign the petition you created

---

## 🛠️ Common Issues & Fixes

### Issue: "Firebase not initialized"
**Fix:** Make sure all Firebase env variables are set correctly in `.env.local`

### Issue: "Supabase connection error"
**Fix:** 
1. Check if Supabase project is running
2. Verify URL and keys in `.env.local`
3. Make sure schema is created (run supabase-schema.sql)

### Issue: "AI not responding"
**Fix:** 
1. Check if Gemini API key is valid
2. Make sure you have API quota remaining
3. Check browser console for errors

### Issue: "OTP not received"
**Fix:**
1. Check Firebase Authentication is enabled
2. Verify phone number format (+91...)
3. Check Firebase console for errors
4. May need to add test phone numbers in Firebase

---

## 📱 Core Features Implemented

✅ **Identity Module**
- Phone OTP authentication
- User profile with city/state/language
- Verified badge system

✅ **AI Rights Assistant**
- Natural language queries
- Legal citations and advice
- Multilingual support (11 languages)
- Integration with petition creation

✅ **Petition Engine**
- AI-assisted petition drafting
- Manual editing capability
- Location tagging
- Evidence upload ready (images/videos)

✅ **Signature System**
- One-click signing
- Verified signature tracking
- Real-time count updates
- Duplicate prevention

✅ **Authority Action**
- AI suggests correct authority
- Auto-generates professional email
- Opens user's email client
- Tracks sent status

✅ **Community Features**
- Browse all petitions
- Filter by category/location
- Search functionality
- Trending petitions

✅ **Dashboard**
- Personal petition management
- Signature tracking
- Status updates
- Impact metrics

---

## 🗺️ Platform Architecture

```
User Journey:
┌─────────────┐
│  Landing    │
│   Page      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Phone OTP   │
│    Auth     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Profile    │
│   Setup     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│            DASHBOARD                    │
├─────────────────────────────────────────┤
│  1. AI Rights Assistant                 │
│  2. Create Petition (AI-powered)        │
│  3. My Petitions (manage & track)       │
│  4. Community (browse & sign)           │
│  5. City Map (coming soon)              │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│  Petition   │
│   Detail    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Sign /    │
│   Share     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Send to     │
│ Authority   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Track     │
│ Resolution  │
└─────────────┘
```

---

## 🔐 Security Features

- **Row Level Security (RLS)** on Supabase tables
- **Phone verification** via Firebase OTP
- **Environment variables** for sensitive data
- **No password storage** (phone-based auth)
- **Signature verification** prevents fakes
- **Personal email sending** (not from platform)

---

## 🌍 Supported Languages

1. English (en)
2. हिंदी - Hindi (hi)
3. தமிழ் - Tamil (ta)
4. తెలుగు - Telugu (te)
5. বাংলা - Bengali (bn)
6. मराठी - Marathi (mr)
7. ગુજરાતી - Gujarati (gu)
8. ಕನ್ನಡ - Kannada (kn)
9. മലയാളം - Malayalam (ml)
10. ਪੰਜਾਬੀ - Punjabi (pa)
11. ଓଡ଼ିଆ - Odia (or)

AI responses work in all languages!

---

## 📊 Database Schema Overview

**Core Tables:**
```
users                    → Verified citizens
petitions                → Civic petitions  
signatures               → Verified signatures
civic_issues             → Community reports
authorities              → Government contacts
petition_updates         → Progress tracking
evidence                 → Uploaded files
ai_queries               → Rights assistant history
notifications            → User alerts
```

All tables have:
- Auto-updating timestamps
- Row Level Security (RLS)
- Proper indexes for performance
- Foreign key constraints

---

## 🚀 Next Steps After Setup

### Immediate Tasks:
1. ✅ Test all user flows
2. ✅ Create 2-3 sample petitions
3. ✅ Test AI assistant with different queries
4. ✅ Verify signature system works

### Phase 2 Features (To Build):
- [ ] City Intelligence Map (Leaflet)
- [ ] Evidence upload (images/videos)
- [ ] Notifications system
- [ ] WhatsApp integration
- [ ] Authority database (real contacts)
- [ ] Mobile responsive improvements
- [ ] Analytics dashboard

### Production Readiness:
- [ ] Add rate limiting on AI calls
- [ ] Implement proper error boundaries
- [ ] Add analytics (Google Analytics/Plausible)
- [ ] Set up monitoring (Sentry)
- [ ] Optimize images and assets
- [ ] Add SEO metadata
- [ ] Set up CDN for media
- [ ] Configure production environment variables

---

## 💡 Development Tips

### Hot Reload Issues?
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Database Changes?
After modifying Supabase schema:
```bash
supabase db reset --local
# Then re-run schema
```

### Type Errors?
```bash
npm run type-check
```

### Build for Production:
```bash
npm run build
npm run start
```

---

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Review supabase-schema.sql for database structure
3. Check browser console for errors
4. Check Next.js terminal for server errors
5. Verify all environment variables are set

---

## 🎯 Success Metrics

Once running, monitor:
- User signups per day
- Petitions created per day
- Signatures collected
- AI queries processed
- Authority emails sent
- Resolutions tracked

---

**Built for India's Civic Future 🇮🇳**

KAIRO - Converting Awareness into Action
