# 🚀 PETICIA - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Firebase Configuration for Production SMS

#### Step 1: Add Production Domain to Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add your Vercel domain(s):
   - `your-app-name.vercel.app` (Vercel default)
   - Your custom domain if you have one

#### Step 2: Test Numbers (Optional for Staging)
For testing without consuming SMS credits:
1. Go to **Authentication** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Add test numbers with fixed OTPs:
   - Example: `+91 83189 15519` → OTP: `123456`

#### Step 3: Enable SMS Provider
1. Go to **Authentication** → **Sign-in method**
2. Ensure **Phone** is enabled
3. Verify your billing is set up (required for production SMS)

---

## 🔐 Environment Variables Setup

### Required Environment Variables for Vercel

#### 1. Firebase Configuration
Get these from Firebase Console → Project Settings → General → Your apps:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

#### 2. Supabase Configuration (Production)
Get these from [Supabase Dashboard](https://app.supabase.com/) → Project Settings → API:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **CRITICAL**: `SUPABASE_SERVICE_ROLE_KEY` is highly sensitive. Never expose it publicly!

#### 3. AI Configuration
Get your Groq API key from [Groq Console](https://console.groq.com/):

```bash
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 4. Application Configuration

```bash
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=PETICIA
```

---

## 📦 Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Install Vercel CLI** (optional but helpful):
   ```bash
   npm install -g vercel
   ```

2. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

3. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Select your repo: `MyKairo`

4. **Configure Build Settings**:
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Add Environment Variables**:
   - Click **Environment Variables**
   - Add all variables from the list above
   - Make sure to select:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (optional)

6. **Deploy**:
   - Click **Deploy**
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-app-name.vercel.app`

### Option 2: Via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts to set up your project
# Add environment variables when prompted
```

---

## 🔄 Post-Deployment Steps

### 1. Update Firebase Authorized Domains
After deployment, add your Vercel domain:
1. Copy your Vercel URL: `your-app-name.vercel.app`
2. Go to Firebase Console → Authentication → Settings → Authorized domains
3. Add the domain (without https://)

### 2. Test SMS OTP
1. Visit your deployed app
2. Try logging in with a real phone number
3. You should receive an actual SMS OTP
4. Verify the OTP works correctly

### 3. Update Supabase CORS (if needed)
If you face CORS issues:
1. Go to Supabase Dashboard → Settings → API
2. Ensure your Vercel domain is allowed

### 4. Monitor First Deployments
- Check Vercel deployment logs for any errors
- Monitor Firebase Console for authentication events
- Test all critical user flows

---

## 🛡️ Security Checklist

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ All sensitive keys added to Vercel only
- ✅ `SUPABASE_SERVICE_ROLE_KEY` never exposed to client
- ✅ Firebase config public keys are safe (they're meant to be public)

### Firebase Security
- ✅ Authorized domains configured
- ✅ Phone authentication enabled
- ✅ Billing enabled for production SMS
- ✅ Rate limiting enabled (Firebase default)

### Supabase Security
- ✅ Row Level Security (RLS) policies enabled
- ✅ Service role key only used in API routes (server-side)
- ✅ Anon key used for client-side operations

---

## 🐛 Common Issues & Solutions

### Issue 1: SMS Not Sending
**Problem**: OTP not delivered to phone

**Solutions**:
1. Verify Firebase billing is enabled
2. Check authorized domains include your Vercel domain
3. Ensure phone number format is correct: `+91xxxxxxxxxx`
4. Check Firebase Console → Authentication logs for errors

### Issue 2: ReCAPTCHA Failed
**Problem**: "reCAPTCHA verification failed"

**Solutions**:
1. Ensure domain is added to Firebase authorized domains
2. Clear browser cache and try again
3. Check browser console for specific reCAPTCHA errors
4. Verify Firebase keys in Vercel environment variables

### Issue 3: Profile Updates Not Saving
**Problem**: User profile changes don't persist

**Solutions**:
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
2. Check API route `/api/user/profile` is working
3. Check Supabase logs for RLS policy errors

### Issue 4: Build Fails on Vercel
**Problem**: Deployment build fails

**Solutions**:
1. Run `npm run build` locally first
2. Check for TypeScript errors: `npm run type-check`
3. Ensure all dependencies are in `package.json`
4. Check Vercel build logs for specific error

### Issue 5: API Routes Return 404
**Problem**: `/api/*` routes not found

**Solutions**:
1. Ensure `vercel.json` is present in root
2. Check Next.js app directory structure
3. Verify API routes are in `src/app/api/` folder

---

## 📊 Monitoring & Analytics

### Vercel Analytics
Enable Vercel Analytics for performance insights:
1. Go to your project in Vercel Dashboard
2. Click **Analytics** tab
3. Enable **Web Analytics**

### Firebase Analytics
Monitor authentication events:
1. Go to Firebase Console → Analytics
2. Check **Authentication** events
3. Monitor SMS delivery rates

### Error Tracking
Consider adding error tracking:
```bash
npm install @sentry/nextjs
# Follow Sentry Next.js setup guide
```

---

## 🔄 Continuous Deployment

### Automatic Deployments
Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically builds and deploys
```

### Preview Deployments
Every branch and PR gets a preview URL:
- Push to any branch
- Get instant preview link
- Perfect for testing before production

---

## 📱 Testing Production SMS

### Test Checklist
1. ✅ Sign up with new phone number
2. ✅ Receive SMS within 30 seconds
3. ✅ Verify OTP works correctly
4. ✅ Profile creation succeeds
5. ✅ Dashboard loads properly
6. ✅ Profile updates work
7. ✅ Petition creation works
8. ✅ All AI features functional

### Test Numbers by Carrier
Test with multiple carriers to ensure SMS delivery:
- Airtel
- Jio
- Vi (Vodafone Idea)
- BSNL

---

## 💰 Cost Estimation

### Firebase (SMS)
- India SMS: ~₹0.50-1.00 per SMS
- Set up billing alerts in Google Cloud Console
- Estimated: ₹500-2000/month for 1000-2000 users

### Vercel
- Free tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless function executions
- Pro tier ($20/month) if you exceed limits

### Supabase
- Free tier includes:
  - 500MB database
  - 1GB file storage
  - 50,000 monthly active users
- Pro tier ($25/month) for production apps

---

## 🎯 Performance Optimization

### Enable Vercel Features
1. **Edge Functions**: For faster API responses
2. **Image Optimization**: Automatic via Next.js
3. **Caching**: Configured in `vercel.json`

### Database Optimization
1. Enable Supabase connection pooling
2. Add database indexes for frequently queried fields
3. Use Supabase cache for read-heavy operations

---

## 🆘 Support Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Phone Auth](https://firebase.google.com/docs/auth/web/phone-auth)
- [Supabase Docs](https://supabase.com/docs)

### Community
- Vercel Discord
- Firebase Support
- Supabase Discord

---

## ✅ Final Deployment Checklist

Before going live:

- [ ] All environment variables added to Vercel
- [ ] Firebase authorized domains updated
- [ ] Firebase billing enabled
- [ ] Supabase production database ready
- [ ] Test SMS with real phone number
- [ ] Test all user flows
- [ ] Check all API routes work
- [ ] Verify profile updates work
- [ ] Test petition creation
- [ ] Test AI features
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (optional)

---

## 🎉 You're Ready!

Your PETICIA app is now production-ready with real SMS OTP authentication. Users can sign in with their actual phone numbers and receive OTPs via SMS.

**First Time Deployment**: Expect 5-10 minutes setup time
**Subsequent Deployments**: Automatic on git push (~2-3 minutes)

Need help? Check the troubleshooting section or reach out to Vercel/Firebase support!
