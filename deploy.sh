#!/bin/bash

echo "🎬 Omni Jimmer Tool - Deployment Script"
echo "========================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "⚠️  Not in a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit - Omni Jimmer Tool"
fi

echo "📦 Preparing deployment..."

# Check if all necessary files exist
if [ ! -f "build-render.sh" ]; then
    echo "❌ build-render.sh not found!"
    exit 1
fi

if [ ! -f "supabase-config.js" ]; then
    echo "❌ supabase-config.js not found!"
    exit 1
fi

if [ ! -d "supabase" ]; then
    echo "❌ supabase/ directory not found!"
    exit 1
fi

echo "✅ All deployment files present"

# Make sure build script is executable
chmod +x build-render.sh

echo "🔧 Files ready for deployment:"
echo "   📄 index.html - Main application"
echo "   🎨 style.css - Enhanced styling from original demo"
echo "   ⚡ app.js - Matrix generation logic"
echo "   🔐 auth.js - API key management"
echo "   🛡️  security-utils.js - Security utilities"
echo "   🏗️  build-render.sh - Render build script"
echo "   ⚙️  supabase-config.js - Environment configuration"
echo "   📁 supabase/ - Edge Functions for AI APIs"

echo ""
echo "🚀 Next steps:"
echo "1. Push to GitHub repository"
echo "2. Connect repository to Render"
echo "3. Set Build Command: './build-render.sh'"
echo "4. Set Environment Variables:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "5. Deploy Supabase Edge Functions (see deploy-functions.md)"
echo ""
echo "📚 For detailed instructions, see deploy-functions.md"
echo "✨ Ready for production deployment!"