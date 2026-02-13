# 🔑 Environment Variables - Quick Reference

## Copy-Paste Template for Vercel

### Firebase Configuration (6 variables)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Supabase Configuration (3 variables)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### AI Configuration (1 variable)
```bash
GROQ_API_KEY=
```

### Application Configuration (2 variables)
```bash
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=PETICIA
```

---

## Where to Find Each Value

### Firebase Values
**Location:** Firebase Console → Project Settings → General → Your apps

1. **NEXT_PUBLIC_FIREBASE_API_KEY**
   - Found in: Firebase config object → `apiKey`
   - Example: `AIzaSyXXXXXXXXXXXXXXXXX`

2. **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
   - Found in: Firebase config object → `authDomain`
   - Example: `your-project.firebaseapp.com`

3. **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
   - Found in: Firebase config object → `projectId`
   - Example: `your-project-id`

4. **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
   - Found in: Firebase config object → `storageBucket`
   - Example: `your-project.appspot.com`

5. **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
   - Found in: Firebase config object → `messagingSenderId`
   - Example: `123456789012`

6. **NEXT_PUBLIC_FIREBASE_APP_ID**
   - Found in: Firebase config object → `appId`
   - Example: `1:123456789012:web:abcdef123456`

### Supabase Values
**Location:** Supabase Dashboard → Project Settings → API

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Found in: Configuration → Project URL
   - Example: `https://abcdefghij.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Found in: Project API keys → `anon` `public`
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ This is safe to use in client-side code

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Found in: Project API keys → `service_role` `secret`
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - 🔒 **KEEP THIS SECRET** - Never expose in client-side code

### Groq API Key
**Location:** https://console.groq.com/ → API Keys

1. **GROQ_API_KEY**
   - Create new API key in Groq Console
   - Example: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Application URLs

1. **NEXT_PUBLIC_APP_URL**
   - **For first deploy:** Use placeholder, then update after deployment
   - **After deploy:** Use your actual Vercel URL
   - Example: `https://peticia.vercel.app`

2. **NEXT_PUBLIC_APP_NAME**
   - Your app display name
   - Default: `PETICIA`

---

## Adding to Vercel Dashboard

### Method 1: One by One

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. For each variable:
   - Click **Add New**
   - Enter **Key** (variable name)
   - Enter **Value** (the actual value)
   - Select environments:
     - ✅ Production (always)
     - ✅ Preview (recommended)
     - ⬜ Development (optional)
   - Click **Save**

### Method 2: Bulk Import (Faster)

1. Create a `.env.production` file locally:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_value_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value_here
   # ... all other variables
   ```

2. Copy all lines

3. In Vercel Dashboard:
   - Go to: Your Project → Settings → Environment Variables
   - Click **Add New**
   - Click **Paste .env**
   - Paste your copied lines
   - Click **Add**

---

## 🎯 Quick Verification

After adding all variables, verify you have exactly **12 variables**:

- [ ] 6 Firebase variables (all start with `NEXT_PUBLIC_FIREBASE_`)
- [ ] 2 Supabase public variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] 1 Supabase secret (`SUPABASE_SERVICE_ROLE_KEY`)
- [ ] 1 AI variable (`GROQ_API_KEY`)
- [ ] 2 App variables (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`)

**Total: 12 variables ✅**

---

## 🔒 Security Notes

### Public Variables (Safe in Browser)
These start with `NEXT_PUBLIC_` and are embedded in your client-side bundle:
- All Firebase config variables
- Supabase URL and anon key
- App URL and name

These are **designed to be public** and are safe to expose.

### Secret Variables (Server-Only)
These must **NEVER** be exposed to the browser:
- `SUPABASE_SERVICE_ROLE_KEY` - Bypasses all database security
- `GROQ_API_KEY` - Your AI API key

Always use these only in:
- API routes (`/api/*`)
- Server components
- Server-side functions

---

## 📝 Example Filled Template

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD8X9Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=peticia-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=peticia-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=peticia-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY4MDAwMDAwMCwiZXhwIjoxOTk1NTc2MDAwfQ.abcdefghijklmnopqrstuvwxyz123456
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjgwMDAwMDAwLCJleHAiOjE5OTU1NzYwMDB9.xyzabcdefghijklmnopqrstuvw987654

# AI
GROQ_API_KEY=gsk_1234567890abcdefghijklmnopqrstuvwxyz

# App
NEXT_PUBLIC_APP_URL=https://peticia.vercel.app
NEXT_PUBLIC_APP_NAME=PETICIA
```

---

## 🚨 Important Reminders

1. **Never commit** `.env.local` or `.env.production` to Git
2. **Rotate keys** if accidentally exposed
3. **Use different keys** for development and production
4. **Backup** your environment variables securely
5. **Update** `NEXT_PUBLIC_APP_URL` after first deployment

---

## Need Help?

- Can't find a value? Check the documentation links in VERCEL_DEPLOYMENT.md
- Values not working? Verify they're copied completely (JWT tokens are very long)
- Deployment fails? Check Vercel logs for which variable is missing
