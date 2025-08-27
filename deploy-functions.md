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

### 1. Link to your existing Supabase project
```bash
# Navigate to your project
cd /Users/matheusaugustoalecrimdesousacorrea/Documents/omni-jimmer-tool

# Link to your existing Supabase project (same as original demo)
supabase link --project-ref zeeyvgspihtrgcdkrsvx
```

### 2. Deploy the Edge Functions
```bash
# Deploy both functions
supabase functions deploy openai-proxy
supabase functions deploy replicate-proxy
```

### 3. Environment Variables (Already Set!)

✅ **Skip this step** - Your environment variables are already configured in your existing Supabase project:

- `OPENAI_API_KEY` ✅ Already set
- `REPLICATE_API_TOKEN` ✅ Already set  
- `SUPABASE_URL` ✅ Already set
- `SUPABASE_ANON_KEY` ✅ Already set

Dashboard: https://supabase.com/dashboard/project/zeeyvgspihtrgcdkrsvx/settings/functions

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

Your functions are available at (same URLs as original demo):
- OpenAI: `https://zeeyvgspihtrgcdkrsvx.supabase.co/functions/v1/openai-proxy`
- Replicate: `https://zeeyvgspihtrgcdkrsvx.supabase.co/functions/v1/replicate-proxy`

These match exactly what your app expects!

## 📝 Next Steps

1. ✅ **Supabase project** - Using existing project `zeeyvgspihtrgcdkrsvx`
2. ✅ **GitHub OAuth** - Already configured in your existing project
3. 🔄 **Deploy to Render** - Set environment variables and deploy
4. 🧪 **Test** - Verify the full authentication flow works