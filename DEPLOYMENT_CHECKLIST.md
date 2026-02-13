# 🚀 Quick Deployment Checklist

## Before Deployment

### 1. Firebase Setup
- [ ] Create Firebase project at https://console.firebase.google.com/
- [ ] Enable Phone Authentication (Authentication → Sign-in method → Phone)
- [ ] Enable Firebase Billing (required for production SMS)
- [ ] Copy Firebase configuration (Project Settings → General → Your apps)
- [ ] (Optional) Add test phone numbers for staging

### 2. Supabase Setup
- [ ] Create Supabase project at https://app.supabase.com/
- [ ] Run SQL schema files:
  - [ ] `supabase-schema.sql` (main database schema)
  - [ ] `add-user-location.sql` (location fields)
  - [ ] `add-delete-policy.sql` (deletion policies)
  - [ ] `fix-data-consistency.sql` (data fixes)
- [ ] Copy Supabase URL and Keys (Project Settings → API)

### 3. Groq API Setup
- [ ] Sign up at https://console.groq.com/
- [ ] Create API key
- [ ] Copy API key

### 4. Vercel Deployment
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add all environment variables (see below)
- [ ] Deploy

### 5. Post-Deployment
- [ ] Copy Vercel deployment URL
- [ ] Add domain to Firebase Authorized domains
- [ ] Test SMS OTP with real phone number
- [ ] Test all critical features

---

## Environment Variables for Vercel

Copy these to Vercel Dashboard → Your Project → Settings → Environment Variables:

### Firebase (6 variables)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Supabase (3 variables)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
⚠️ Mark `SUPABASE_SERVICE_ROLE_KEY` as sensitive

### AI (1 variable)
```
GROQ_API_KEY=
```

### App Configuration (2 variables)
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=PETICIA
```

**Total: 12 environment variables**

---

## Post-Deployment Steps

1. **Update Firebase Authorized Domains**:
   - Go to Firebase Console → Authentication → Settings
   - Click "Authorized domains"
   - Add your Vercel domain: `your-app-name.vercel.app`

2. **Test SMS Authentication**:
   - Visit your deployed app
   - Try signing in with a real phone number
   - Verify SMS OTP arrives within 30 seconds

3. **Test Critical Features**:
   - [ ] User registration
   - [ ] User login
   - [ ] Profile updates
   - [ ] Create petition
   - [ ] View petitions
   - [ ] AI Assistant
   - [ ] Sign petition

---

## Common Deployment Issues

### SMS Not Working
✅ **Solution**: Add Vercel domain to Firebase Authorized domains

### API Routes 404
✅ **Solution**: Ensure `vercel.json` is in project root

### Build Fails
✅ **Solution**: Run `npm run build` locally first to catch errors

### Profile Updates Fail
✅ **Solution**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set

---

## Quick Commands

```bash
# Test build locally
npm run build

# Type check
npm run type-check

# Deploy to Vercel
vercel --prod

# Check for errors
npm run lint
```

---

## Estimated Time
- **First-time setup**: 30-45 minutes
- **Subsequent deployments**: 2-3 minutes (automatic)

## Cost Estimate
- Vercel: Free tier (sufficient for MVP)
- Supabase: Free tier (up to 50k users)
- Firebase SMS: ~₹0.50-1.00 per SMS
- Groq API: Free tier available

---

Need detailed help? See `DEPLOYMENT_GUIDE.md`
