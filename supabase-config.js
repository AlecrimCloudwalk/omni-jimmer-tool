// Supabase Configuration - Development with local API keys 
// This file will be replaced by build-render.sh during deployment

const supabaseConfig = {
  url: 'http://localhost:54321', // Local development URL
  anonKey: 'development-key', // Development placeholder
  
  // Edge Function URLs (will be replaced during build)
  functions: {
    openai: 'http://localhost:54321/functions/v1/openai-proxy',
    replicate: 'http://localhost:54321/functions/v1/replicate-proxy'
  },
  
  // Local development API keys (from .env file)
  // These will be automatically loaded for local testing
  development: {
    autoLoadKeys: true,
    openaiKey: 'OPENAI_API_KEY', // Will be loaded from localStorage or auto-set
    replicateKey: 'REPLICATE_API_TOKEN' // Will be loaded from localStorage or auto-set
  }
};

// Export for use in main app
window.supabaseConfig = supabaseConfig;
console.log('🔧 Supabase config loaded (development mode):', supabaseConfig.url);
console.log('🔑 Development mode: Will auto-load API keys for local testing');
console.log('⚠️  This is a development configuration. Production will use environment variables.');
