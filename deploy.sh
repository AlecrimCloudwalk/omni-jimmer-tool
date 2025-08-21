#!/bin/bash

# Omni Jimmer Tool Deployment Script
# This script helps deploy the application to various hosting platforms

set -e

echo "🚀 Omni Jimmer Tool Deployment Script"
echo "======================================"

# Check if we have the necessary files
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Make sure you're in the project root."
    exit 1
fi

# Create deployment directory
DEPLOY_DIR="dist"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

echo "📦 Copying files to deployment directory..."

# Copy all necessary files
cp index.html $DEPLOY_DIR/
cp style.css $DEPLOY_DIR/
cp app.js $DEPLOY_DIR/
cp auth.js $DEPLOY_DIR/
cp security-utils.js $DEPLOY_DIR/
cp README.md $DEPLOY_DIR/

# Copy any additional assets if they exist
if [ -d "assets" ]; then
    cp -r assets $DEPLOY_DIR/
fi

if [ -d "images" ]; then
    cp -r images $DEPLOY_DIR/
fi

echo "✅ Files copied successfully!"

# Update URLs in the deployment files if a new base URL is provided
if [ ! -z "$1" ]; then
    NEW_URL="$1"
    echo "🔄 Updating URLs to: $NEW_URL"
    
    # Update any hardcoded URLs in the files
    # This is where you would update API endpoints, CDN URLs, etc.
    sed -i.bak "s|https://api.replicate.com|$NEW_URL/api/replicate|g" $DEPLOY_DIR/auth.js || true
    sed -i.bak "s|https://api.openai.com|$NEW_URL/api/openai|g" $DEPLOY_DIR/auth.js || true
    
    # Clean up backup files
    find $DEPLOY_DIR -name "*.bak" -delete
    
    echo "✅ URLs updated!"
fi

echo "📊 Deployment Summary:"
echo "- Deployment directory: $DEPLOY_DIR"
echo "- Files included:"
ls -la $DEPLOY_DIR

echo ""
echo "🌐 Deployment Options:"
echo ""
echo "1. Static File Hosting (Netlify, Vercel, GitHub Pages):"
echo "   - Upload the contents of the '$DEPLOY_DIR' directory"
echo "   - Set index.html as the main file"
echo ""
echo "2. Traditional Web Server:"
echo "   - Copy contents of '$DEPLOY_DIR' to your web server's document root"
echo "   - Ensure the server can serve static files"
echo ""
echo "3. Local Development Server:"
echo "   cd $DEPLOY_DIR && python3 -m http.server 8080"
echo "   Then visit: http://localhost:8080"
echo ""
echo "4. Node.js Simple Server:"
echo "   npx serve $DEPLOY_DIR -l 8080"
echo ""

echo "✨ Deployment preparation complete!"
echo ""
echo "⚠️  Remember to:"
echo "   - Configure your API keys in the deployed application"
echo "   - Test all functionality after deployment"
echo "   - Set up HTTPS for production use"
echo "   - Consider setting up a CDN for better performance"
