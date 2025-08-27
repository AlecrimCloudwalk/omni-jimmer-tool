// @ts-ignore: Deno global available in Supabase Edge Functions
declare const Deno: any;

// @ts-ignore: Deno supports URL imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno supports URL imports  
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Get allowed origins based on environment
function getAllowedOrigin(request: Request): string {
  const origin = request.headers.get('origin') || '';
  
  // Handle null origin (file:// protocol for local development)  
  if (!origin || origin === 'null' || origin === '') {
    return '*'; // Allow file:// protocol for local development
  }
  
  // Allow localhost for development
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return origin;
  }
  
  // Allow your production domains
  const allowedDomains = [
    'https://cloudwalk.github.io',
    'https://zeeyvgspihtrgcdkrsvx.supabase.co',
    'https://omni-demo.onrender.com',
    'https://design-cw-omni.onrender.com',
    'https://omni-demo.vercel.app',
    // Add your new project's domains here
    'https://omni-jimmer-tool.onrender.com'
  ];
  
  // Check exact matches and subdomain matches
  if (allowedDomains.some(domain => origin === domain || origin.startsWith(domain))) {
    return origin;
  }
  
  // Fallback - reject unknown origins
  return 'null';
}

const getCorsHeaders = (request: Request) => {
  const allowedOrigin = getAllowedOrigin(request);
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  
  // Only add credentials header if origin is not '*'
  if (allowedOrigin !== '*') {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  
  return headers;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user email is from @cloudwalk.io domain or specifically allowed
    const allowedEmails = ['lupape@gmail.com']
    const isCloudwalkEmail = user.email?.endsWith('@cloudwalk.io')
    const isAllowedEmail = allowedEmails.includes(user.email || '')
    
    if (!isCloudwalkEmail && !isAllowedEmail) {
      console.error('Access denied - not authorized email:', user.email)
      return new Response(
        JSON.stringify({ error: 'Access denied - Cloudwalk employees only' }), 
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ Authenticated user:', user.email)

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY environment variable not set')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the request body
    const requestBody = await req.json()
    console.log('🔄 Proxying OpenAI request for user:', user.email)

    // Make request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ OpenAI API error:', response.status, responseData)
      return new Response(
        JSON.stringify(responseData), 
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ OpenAI request successful')
    return new Response(
      JSON.stringify(responseData), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Error in openai-proxy:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
