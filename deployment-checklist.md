# 🚀 Deployment Checklist

Use this checklist to ensure your deployment is properly configured.

## ✅ Pre-Deployment Checklist

### 🔧 Supabase Setup
- [ ] Supabase project created
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Logged into Supabase CLI (`supabase login`)
- [ ] Project linked (`supabase link --project-ref YOUR_REF`)
- [ ] Edge functions deployed (`supabase functions deploy`)

### 🔑 Environment Variables in Supabase
- [ ] `OPENAI_API_KEY` set in Supabase dashboard
- [ ] `REPLICATE_API_TOKEN` set in Supabase dashboard
- [ ] `SUPABASE_URL` configured
- [ ] `SUPABASE_ANON_KEY` configured

### 🔐 GitHub OAuth Configuration
- [ ] GitHub OAuth app created
- [ ] Client ID and Secret configured in Supabase
- [ ] Callback URL set: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Homepage URL set to your production domain

### 🌐 Render Deployment
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Build command set: `npm run build`
- [ ] Start command set: `python3 -m http.server $PORT`
- [ ] Environment variables set in Render dashboard:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`

### 🔄 Domain Configuration
- [ ] Production domain noted (e.g., `https://omni-jimmer-tool.onrender.com`)
- [ ] Domain added to Supabase Auth redirect URLs
- [ ] Domain added to Supabase functions `allowedDomains`
- [ ] Functions redeployed after domain update

## 🧪 Testing Checklist

### Local Testing
- [ ] `npm run dev` works
- [ ] Supabase functions start locally (`supabase start`)
- [ ] Local authentication flow works
- [ ] API calls work through functions

### Production Testing
- [ ] Production site loads
- [ ] GitHub login button appears
- [ ] Authentication flow completes
- [ ] Only @cloudwalk.io users can access
- [ ] Image generation works
- [ ] Video generation works
- [ ] No CORS errors in console

## 🚨 Common Issues & Solutions

### ❌ "Authentication failed"
- Check GitHub OAuth configuration
- Verify callback URLs match exactly
- Ensure Supabase auth is configured correctly

### ❌ "CORS error"
- Check `allowedDomains` in Supabase functions
- Redeploy functions after updating domains
- Verify production URL is correct

### ❌ "API key not configured"
- Check environment variables in Supabase dashboard
- Ensure function deployment succeeded
- Verify variable names match exactly

### ❌ "Build failed on Render"
- Check `build-render.sh` is executable
- Verify environment variables in Render
- Check build logs for specific errors

## 🎯 Success Criteria

✅ **Deployment is successful when:**
- Site loads at production URL
- GitHub authentication works
- Only authorized users can access
- Image and video generation work
- No console errors
- Functions respond correctly

## 📞 Support

If you encounter issues:
1. Check the troubleshooting sections in each guide
2. Review Supabase function logs
3. Check Render build/deployment logs
4. Verify all environment variables are set correctly
