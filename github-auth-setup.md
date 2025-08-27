# 🔐 GitHub OAuth Setup for Supabase

## Prerequisites

1. A Supabase project set up
2. A GitHub account with access to create OAuth apps

## 🔧 Step 1: Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `Omni Jimmer Tool`
   - **Homepage URL**: `https://omni-jimmer-tool.onrender.com` (or your domain)
   - **Application description**: `AI video generator for Brazilian businesses`
   - **Authorization callback URL**: `https://zeeyvgspihtrgcdkrsvx.supabase.co/auth/v1/callback`

4. Click "Register application"
5. Note down the **Client ID** and generate a **Client Secret**

## 🔧 Step 2: Configure Supabase (Already Done!)

✅ **Skip this step** - GitHub OAuth is already configured in your existing Supabase project!

Your GitHub OAuth settings are already set up at:
https://supabase.com/dashboard/project/zeeyvgspihtrgcdkrsvx/auth/providers

## 🔧 Step 3: Configure Redirect URLs

In your Supabase Auth settings:

1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `https://omni-jimmer-tool.onrender.com` (your production domain)
3. Add **Redirect URLs**:
   - `https://omni-jimmer-tool.onrender.com`
   - `http://localhost:3000` (for local development)
   - `http://127.0.0.1:3000` (for local development)

## 🔧 Step 4: Test Authentication

1. Deploy your Supabase functions (see deploy-functions.md)
2. Make sure your app loads the `auth.js` file
3. Test the GitHub login button
4. Verify that only @cloudwalk.io users can access the API functions

## 🛡️ Security Notes

- The authentication is restricted to @cloudwalk.io email domain
- API keys are stored securely in Supabase environment variables
- All API calls go through authenticated proxy functions
- CORS is properly configured for your domains

## 🔍 Troubleshooting

If GitHub auth isn't working:

1. Check that the redirect URL matches exactly in both GitHub and Supabase
2. Verify the Client ID and Secret are correct
3. Make sure the site URL is set correctly in Supabase
4. Check browser console for any CORS errors
5. Ensure your domain is added to the allowed origins in the Supabase functions
