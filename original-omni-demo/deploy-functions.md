# 🚀 Deploy Supabase Edge Functions

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
cd /Users/matheusaugustoalecrimdesousacorrea/Documents/omni-demo

# Link to your existing Supabase project
supabase link --project-ref zeeyvgspihtrgcdkrsvx
```

### 2. Deploy the Edge Functions
```bash
# Deploy both functions
supabase functions deploy openai-proxy
supabase functions deploy replicate-proxy
```

### 3. Set Environment Variables in Supabase

Go to your Supabase dashboard and set these secrets:

1. **Navigate to**: https://supabase.com/dashboard/project/zeeyvgspihtrgcdkrsvx/settings/functions
2. **Set these environment variables**:
   - `OPENAI_API_KEY` = your OpenAI API key
   - `REPLICATE_API_TOKEN` = your Replicate API token
   - `SUPABASE_URL` = https://zeeyvgspihtrgcdkrsvx.supabase.co
   - `SUPABASE_ANON_KEY` = your anon key

### 4. Test the Functions

You can test them with:
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
- OpenAI: `https://zeeyvgspihtrgcdkrsvx.supabase.co/functions/v1/openai-proxy`
- Replicate: `https://zeeyvgspihtrgcdkrsvx.supabase.co/functions/v1/replicate-proxy`

These match exactly what your app expects!
