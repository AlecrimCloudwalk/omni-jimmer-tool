# 🚀 Render Deployment Guide

## 📋 Prerequisites

1. **Supabase Project** - Set up and configured with GitHub OAuth
2. **GitHub Repository** - Your code pushed to GitHub
3. **Render Account** - Free tier available at https://render.com

## 🔧 Step 1: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `omni-jimmer-tool`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `python3 -m http.server $PORT`

## 🔧 Step 2: Environment Variables

Add these environment variables in Render:

### Required Variables
- `SUPABASE_URL` = `https://zeeyvgspihtrgcdkrsvx.supabase.co`
- `SUPABASE_ANON_KEY` = Your Supabase anon key

### Where to find these values:
1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Copy the **Project URL** and **anon public** key

## 🔧 Step 3: Domain Configuration

1. After deployment, note your Render URL (e.g., `https://omni-jimmer-tool.onrender.com`)
2. Update your Supabase Auth settings:
   - **Site URL**: Set to your Render URL
   - **Redirect URLs**: Add your Render URL
3. Update GitHub OAuth app:
   - **Homepage URL**: Your Render URL
   - **Authorization callback URL**: `https://zeeyvgspihtrgcdkrsvx.supabase.co/auth/v1/callback`

## 🔧 Step 4: Update Supabase Functions

Update the allowed domains in your Supabase functions:

1. Edit `supabase/functions/openai-proxy/index.ts`
2. Edit `supabase/functions/replicate-proxy/index.ts`
3. Add your Render URL to the `allowedDomains` array
4. Deploy functions: `supabase functions deploy`

## 🎯 Deployment Flow

```bash
# Local development
npm run dev

# Test build locally
npm run build

# Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# Render auto-deploys from GitHub
```

## 🔍 Troubleshooting

### Build Fails
- Check that `build-render.sh` is executable: `chmod +x build-render.sh`
- Verify environment variables are set in Render dashboard
- Check build logs for specific errors

### Authentication Issues
- Verify GitHub OAuth app callback URL
- Check Supabase redirect URLs
- Ensure domain is added to Supabase functions allowed list

### CORS Errors
- Verify your domain is in the Supabase functions `allowedDomains`
- Check that functions are deployed with updated code
- Test function endpoints directly

## 🛡️ Security Checklist

- ✅ Environment variables set in Render (not in code)
- ✅ GitHub OAuth restricted to your domains
- ✅ Supabase functions authenticate users
- ✅ API keys stored in Supabase environment variables
- ✅ CORS properly configured

## 📚 Next Steps

1. Test the full authentication flow
2. Verify image and video generation work
3. Set up monitoring and error tracking
4. Configure custom domain (optional)

Your app should now be live at `https://omni-jimmer-tool.onrender.com`! 🎉
