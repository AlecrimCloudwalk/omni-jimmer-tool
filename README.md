# 🎬 Omni Jimmer Tool - AI Video Matrix Generator

Advanced matrix-based AI video generator for Brazilian businesses with CNAE classification and product-specific content generation.

## 🚀 Features

* **📊 Matrix Generation** - Products vs CNAEs grid system
* **🎯 Product-Specific Prompts** - 11 customizable product types per CNAE
* **🇧🇷 CNAE Integration** - Brazilian business classification support
* **🎨 Bulk Generation** - Generate by row, column, or full matrix
* **📱 Dynamic Interface** - Add/remove products and CNAEs on the fly
* **🎪 Demo Carousel** - Interactive preview with CNAE selection
* **🔐 GitHub OAuth Authentication** - Secure access via Supabase
* **🛡️ Domain Restriction** - Access limited to @cloudwalk.io emails

## 🚀 Quick Start

### Local Development
```bash
# Clone and install
git clone <your-repo-url>
cd omni-jimmer-tool
npm install

# Run development server
npm run dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to Render (automatic via GitHub)
git push origin main
```

## 🔧 Setup Guide

### 1. Supabase Configuration
- Create a Supabase project
- Deploy edge functions: `supabase functions deploy`
- Set environment variables (OpenAI, Replicate API keys)
- Configure GitHub OAuth

📚 **Detailed Guide**: [deploy-functions.md](deploy-functions.md)

### 2. GitHub OAuth Setup
- Create GitHub OAuth app
- Configure callback URLs
- Set up domain restrictions

📚 **Detailed Guide**: [github-auth-setup.md](github-auth-setup.md)

### 3. Render Deployment
- Connect GitHub repository
- Set environment variables
- Configure custom domain

📚 **Detailed Guide**: [render-deployment.md](render-deployment.md)

## 🔧 How to Use

1. **🏗️ Set up Matrix** - Define your CNAEs and product types
2. **📝 Add Prompts** - Customize prompts for each product/CNAE combination
3. **🎯 Generate Content** - Choose to generate by row, column, or full matrix
4. **📱 Preview Demo** - Test the carousel with different CNAEs

## 🛡️ Security Features

- ✅ **Authentication Required** - GitHub OAuth via Supabase
- ✅ **Domain Restricted** - Only @cloudwalk.io users
- ✅ **Server-side API Keys** - No client-side exposure
- ✅ **CORS Protection** - Proper origin validation

## 🎯 Perfect for Brazilian Enterprise Content

* **Scalable matrix system** - Flexible rows and columns
* **CNAE-specific contexts** - Authentic business classifications
* **Product diversity** - Multiple content types per business category
* **Bulk operations** - Efficient mass content generation
* **Enterprise security** - GitHub OAuth with domain restrictions

## 🔑 Environment Variables

### Supabase (Set in Supabase Dashboard)
- `OPENAI_API_KEY` - Your OpenAI API key
- `REPLICATE_API_TOKEN` - Your Replicate API token

### Render (Set in Render Dashboard)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key

---

**🌟 Ready to create systematic, diverse Brazilian business content at scale with enterprise security!**
