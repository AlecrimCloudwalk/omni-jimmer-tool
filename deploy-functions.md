# 🚀 Deploy Supabase Edge Functions for Omni Jimmer Tool

## Prerequisites

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

## 🔧 Setup Steps

### 1. Link to your Supabase project
```bash
# Navigate to your project
cd /Users/matheusaugustoalecrimdesousacorrea/Documents/omni-jimmer-tool

# Link to your existing Supabase project (replace with your project ref)
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Deploy the Edge Functions
```bash
# Deploy both functions
supabase functions deploy openai-proxy
supabase functions deploy replicate-proxy
```

### 3. Set Environment Variables in Supabase

Go to your Supabase dashboard and set these secrets:

1. **Navigate to**: https://supabase.com/dashboard/project/YOUR_PROJECT_REF/settings/functions
2. **Set these environment variables**:
   - `OPENAI_API_KEY` = your OpenAI API key
   - `REPLICATE_API_TOKEN` = your Replicate API token
   - `SUPABASE_URL` = https://YOUR_PROJECT_REF.supabase.co
   - `SUPABASE_ANON_KEY` = your anon key

### 4. Test the Functions

You can test them locally with:
```bash
# Test OpenAI proxy
supabase functions serve openai-proxy

# Test Replicate proxy  
supabase functions serve replicate-proxy
```

## 🔒 Security Features

✅ **Authentication required** - Only @cloudwalk.io users can access
✅ **Server-side API keys** - No client-side exposure
✅ **CORS headers** - Proper cross-origin support
✅ **Error handling** - Comprehensive error responses

## 🎯 Function URLs

After deployment, your functions will be available at:
- OpenAI: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/openai-proxy`
- Replicate: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/replicate-proxy`

## 🌐 Deploy to Render

1. **Connect your GitHub repository** to Render
2. **Set Build Command**: `./build-render.sh`
3. **Set Publish Directory**: `.` (root)
4. **Add Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

The build script will automatically inject these at deployment time!

## 🎬 Omni Jimmer Tool Features

This deployment supports:
- ✅ Matrix-based AI content generation
- ✅ Brazilian business context
- ✅ CNAE classification support
- ✅ Multi-product campaigns
- ✅ Secure API key management
- ✅ Real-time generation progress
- ✅ Export/Import functionality
