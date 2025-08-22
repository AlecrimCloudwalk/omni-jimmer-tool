/**
 * Authentication and API management for Omni Jimmer Tool
 */

class AuthManager {
    constructor() {
        this.apiKeys = {
            openai: null,
            replicate: null
        };
        this.loadStoredKeys();
        this.setupEventListeners();
    }

    /**
     * Load API keys from secure storage
     */
    loadStoredKeys() {
        // Check if SecurityUtils is available
        if (window.SecurityUtils && typeof window.SecurityUtils.getApiKey === 'function') {
            this.apiKeys.openai = window.SecurityUtils.getApiKey('openai');
            this.apiKeys.replicate = window.SecurityUtils.getApiKey('replicate');
        } else {
            console.warn('SecurityUtils not available yet, will retry later');
            // Retry after a short delay
            setTimeout(() => {
                if (window.SecurityUtils && typeof window.SecurityUtils.getApiKey === 'function') {
                    this.apiKeys.openai = window.SecurityUtils.getApiKey('openai');
                    this.apiKeys.replicate = window.SecurityUtils.getApiKey('replicate');
                    this.updateKeyDisplays();
                }
            }, 100);
        }
        
        // Auto-load development keys if in development mode and no keys stored
        if (this.isDevelopmentMode() && (!this.apiKeys.openai || !this.apiKeys.replicate)) {
            this.loadDevelopmentKeys();
        }
        
        this.updateKeyDisplays();
    }

    /**
     * Check if we're in development mode
     */
    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.port !== '';
    }

    /**
     * Load development API keys from environment
     */
    loadDevelopmentKeys() {
        console.log('🔑 Development mode: Auto-loading API keys...');
        
        // Development API keys (these would normally come from .env in a Node.js environment)
        // For client-side development, we'll store them temporarily
        const devKeys = {
            openai: 'YOUR_OPENAI_API_KEY_HERE',
            replicate: 'YOUR_REPLICATE_API_KEY_HERE'
        };

        try {
            if (devKeys.openai && !this.apiKeys.openai) {
                window.SecurityUtils.storeApiKey('openai', devKeys.openai);
                this.apiKeys.openai = devKeys.openai;
                console.log('✅ Auto-loaded OpenAI API key for development');
            }

            if (devKeys.replicate && !this.apiKeys.replicate) {
                window.SecurityUtils.storeApiKey('replicate', devKeys.replicate);
                this.apiKeys.replicate = devKeys.replicate;
                console.log('✅ Auto-loaded Replicate API key for development');
            }

            if (devKeys.openai || devKeys.replicate) {
                this.showSuccess('🔑 Development API keys loaded automatically!');
            }
        } catch (error) {
            console.warn('⚠️  Could not auto-load development keys:', error.message);
        }
    }

    /**
     * Set up event listeners for API key management
     */
    setupEventListeners() {
        // Individual save buttons
        const saveOpenAIBtn = document.getElementById('save-openai-key');
        const saveReplicateBtn = document.getElementById('save-replicate-key');
        
        if (saveOpenAIBtn) {
            saveOpenAIBtn.addEventListener('click', () => {
                this.saveOpenAIKey();
            });
        }
        
        if (saveReplicateBtn) {
            saveReplicateBtn.addEventListener('click', () => {
                this.saveReplicateKey();
            });
        }

        // Auto-save on Enter key
        const openaiInput = document.getElementById('openai-key');
        const replicateInput = document.getElementById('replicate-key');
        
        if (openaiInput) {
            openaiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveOpenAIKey();
                }
            });
        }
        
        if (replicateInput) {
            replicateInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveReplicateKey();
                }
            });
        }
    }

    /**
     * Save API keys securely
     */
    saveApiKeys() {
        const openaiKey = document.getElementById('openai-key').value.trim();
        const replicateKey = document.getElementById('replicate-key').value.trim();
        
        try {
            // Validate keys
            if (openaiKey && !window.SecurityUtils.validateApiKey('openai', openaiKey)) {
                throw new Error('Invalid OpenAI API key format');
            }
            
            if (replicateKey && !window.SecurityUtils.validateApiKey('replicate', replicateKey)) {
                throw new Error('Invalid Replicate API key format');
            }

            // Store keys
            if (openaiKey) {
                window.SecurityUtils.storeApiKey('openai', openaiKey);
                this.apiKeys.openai = openaiKey;
            }
            
            if (replicateKey) {
                window.SecurityUtils.storeApiKey('replicate', replicateKey);
                this.apiKeys.replicate = replicateKey;
            }

            // Clear input fields
            document.getElementById('openai-key').value = '';
            document.getElementById('replicate-key').value = '';
            
            // Update displays
            this.updateKeyDisplays();
            
            this.showSuccess('API keys saved successfully!');
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Save OpenAI API key securely
     */
    saveOpenAIKey() {
        const openaiKey = document.getElementById('openai-key').value.trim();
        
        try {
            if (!openaiKey) {
                throw new Error('Please enter an OpenAI API key');
            }
            
            if (!window.SecurityUtils.validateApiKey('openai', openaiKey)) {
                throw new Error('Invalid OpenAI API key format');
            }

            window.SecurityUtils.storeApiKey('openai', openaiKey);
            this.apiKeys.openai = openaiKey;
            document.getElementById('openai-key').value = '';
            this.updateKeyDisplays();
            this.showSuccess('OpenAI API key saved successfully!');
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Save Replicate API key securely
     */
    saveReplicateKey() {
        const replicateKey = document.getElementById('replicate-key').value.trim();
        
        try {
            if (!replicateKey) {
                throw new Error('Please enter a Replicate API key');
            }
            
            if (!window.SecurityUtils.validateApiKey('replicate', replicateKey)) {
                throw new Error('Invalid Replicate API key format');
            }

            window.SecurityUtils.storeApiKey('replicate', replicateKey);
            this.apiKeys.replicate = replicateKey;
            document.getElementById('replicate-key').value = '';
            this.updateKeyDisplays();
            this.showSuccess('Replicate API key saved successfully!');
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Update key status displays
     */
    updateKeyDisplays() {
        const openaiInput = document.getElementById('openai-key');
        const replicateInput = document.getElementById('replicate-key');
        
        if (this.apiKeys.openai) {
            openaiInput.placeholder = `OpenAI: ${window.SecurityUtils.maskApiKey(this.apiKeys.openai)}`;
            openaiInput.classList.add('api-key-set');
        } else {
            openaiInput.placeholder = 'OpenAI API Key';
            openaiInput.classList.remove('api-key-set');
        }
        
        if (this.apiKeys.replicate) {
            replicateInput.placeholder = `Replicate: ${window.SecurityUtils.maskApiKey(this.apiKeys.replicate)}`;
            replicateInput.classList.add('api-key-set');
        } else {
            replicateInput.placeholder = 'Replicate API Key';
            replicateInput.classList.remove('api-key-set');
        }
    }

    /**
     * Check if required API keys are available
     */
    hasRequiredKeys() {
        const hasOpenAI = !!this.apiKeys.openai;
        const hasReplicate = !!this.apiKeys.replicate;
        
        console.log('🔑 API Keys check:', {
            openai: hasOpenAI ? 'Present' : 'Missing',
            replicate: hasReplicate ? 'Present' : 'Missing',
            bothPresent: hasOpenAI && hasReplicate
        });
        
        return hasOpenAI && hasReplicate;
    }

    /**
     * Get API key for a specific provider
     */
    getApiKey(provider) {
        return this.apiKeys[provider];
    }

    /**
     * Make authenticated API call to OpenAI
     */
    async callOpenAI(endpoint, data, options = {}) {
        if (!this.apiKeys.openai) {
            throw new Error('OpenAI API key not configured');
        }

        try {
            window.SecurityUtils.checkRateLimit('openai', 60); // 60 calls per minute

            const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.openai}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('OpenAI API call failed:', error);
            throw error;
        }
    }

    /**
     * Make authenticated API call to Replicate (with proxy fallback)
     */
    async callReplicate(endpoint, data, options = {}) {
        if (!this.apiKeys.replicate) {
            throw new Error('Replicate API key not configured');
        }

        try {
            window.SecurityUtils.checkRateLimit('replicate', 30); // 30 calls per minute

            // Try local proxy first (if available)
            try {
                console.log('🔄 Trying local CORS proxy for Replicate...');
                const proxyResponse = await fetch('http://localhost:3001/api/replicate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKeys.replicate}`,
                        ...options.headers
                    },
                    body: JSON.stringify(data)  // Send data directly without endpoint wrapper
                });

                if (proxyResponse.ok) {
                    console.log('✅ Local proxy successful');
                    return await proxyResponse.json();
                } else {
                    console.warn('⚠️ Local proxy failed, trying Supabase proxy...');
                }
            } catch (proxyError) {
                console.warn('⚠️ Local proxy not available, trying Supabase proxy...', proxyError.message);
            }

            // Try Supabase proxy as fallback
            if (window.supabaseConfig?.functions?.replicate) {
                console.log('🔄 Trying Supabase proxy for Replicate...');
                try {
                    const response = await fetch(window.supabaseConfig.functions.replicate, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...options.headers
                        },
                        body: JSON.stringify({
                            endpoint: endpoint,
                            ...data
                        })
                    });

                    if (response.ok) {
                        console.log('✅ Supabase proxy successful');
                        return await response.json();
                    } else {
                        console.warn('⚠️ Supabase proxy failed, trying direct call...');
                    }
                } catch (proxyError) {
                    console.warn('⚠️ Supabase proxy not available, trying direct call...', proxyError.message);
                }
            }

            // Fallback to direct API call
            console.log('🔄 Making direct Replicate API call...');
            const response = await fetch(`https://api.replicate.com/v1/${endpoint}`, {
                method: options.method || 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.replicate}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: data ? JSON.stringify(data) : undefined
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Replicate API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Replicate API call failed:', error);
            
            // If CORS error, provide helpful message
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                throw new Error('CORS error: Direct API calls are blocked by the browser. Please start the Supabase functions or use a proxy server.');
            }
            
            throw error;
        }
    }

    /**
     * Generate enhanced prompt using OpenAI
     */
    async enhancePrompt(basePrompt, cnaeContext, productType) {
        const systemPrompt = `You are an expert at creating detailed, professional prompts for AI image generation focused on Brazilian business contexts.

Task: Enhance the given prompt for a ${productType} image in the context of ${cnaeContext}.

Requirements:
- Keep the core intent of the original prompt
- Add specific Brazilian business context
- Include professional, clean environment details
- Ensure diversity and authenticity
- Avoid any text, logos, or brands in the image
- Make it specific for high-quality commercial use
- Maximum 500 characters

Original prompt: ${basePrompt}`;

        try {
            const response = await this.callOpenAI('chat/completions', {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: `Enhance this prompt: "${basePrompt}"`
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.warn('Failed to enhance prompt, using original:', error);
            return basePrompt;
        }
    }

    /**
     * Generate prompt using OpenAI with specific instructions and structured input
     */
    async generatePromptWithInstructions(instructions, structuredInput) {
        console.log('🔑 generatePromptWithInstructions called');
        console.log('📋 Instructions length:', instructions.length);
        console.log('📄 Structured input:', structuredInput);
        
        if (!this.apiKeys.openai) {
            throw new Error('OpenAI API key not configured');
        }
        
        try {
            console.log('🚀 Making OpenAI API call...');
            
            const response = await this.callOpenAI('chat/completions', {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: instructions
                    },
                    {
                        role: 'user',
                        content: structuredInput
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            });

            console.log('📨 OpenAI response received:', response);
            const generatedPrompt = response.choices[0].message.content.trim();
            console.log('✨ Final generated prompt:', generatedPrompt);
            
            return generatedPrompt;
        } catch (error) {
            console.error('❌ Failed to generate prompt with instructions:', error);
            console.error('Error details:', error.message);
            throw error;
        }
    }

    /**
     * Generate image using Replicate (copied from working original app)
     */
    async generateImage(prompt, options = {}) {
        try {
            console.log('🎨 Starting image generation with prompt:', prompt);
            
            // Development mode: Skip actual image generation for faster testing
            // Set window.enableRealImages = true in console to test real image generation
            const isDev = this.isDevelopmentMode();
            const isLocalhost = window.location.hostname === 'localhost';
            const enableReal = window.enableRealImages;
            
            console.log('🔍 Image generation mode check:', { isDev, isLocalhost, enableReal, willUsePlaceholder: isDev && isLocalhost && !enableReal });
            
            if (isDev && isLocalhost && !enableReal) {
                console.log('🚧 Development mode: Using placeholder image');
                console.log('💡 To test real image generation, run: window.enableRealImages = true');
                // Return a placeholder image for development
                return ['https://picsum.photos/1024/1024?random=' + Math.floor(Math.random() * 1000)];
            }
            
            console.log('🎨 Proceeding with real image generation!');
            
            // Generate seed like the original app
            const imageSeed = Math.floor(Math.random() * 1000000);
            console.log(`🖼️ Image Seed: ${imageSeed}`);

            // Use the exact same format as the working original app
            const body = {
                model: 'bytedance/seedream-3',
                input: {
                    prompt: prompt,
                    guidance_scale: 2.5,
                    seed: imageSeed,
                    width: 1000,
                    height: 1000,
                    num_outputs: 1
                }
            };

            console.log('🔄 Image request body:', JSON.stringify(body, null, 2));
            
            // Use local proxy with same format as original
            const prediction = await this.callReplicate('', body);
            
            console.log('✅ Prediction response:', prediction);
            
            // Handle the response like the original app
            let extractedUrl = null;
            
            if (prediction.output) {
                if (Array.isArray(prediction.output) && prediction.output.length > 0) {
                    extractedUrl = prediction.output[0];
                    console.log('📸 Image URL extracted from array:', extractedUrl);
                } else if (typeof prediction.output === 'string') {
                    extractedUrl = prediction.output;
                    console.log('📸 Image URL extracted as string:', extractedUrl);
                }
            }
            
            if (extractedUrl) {
                return [extractedUrl];
            } else {
                throw new Error('No image URL found in response');
            }
            
        } catch (error) {
            console.error('Image generation failed:', error);
            
            // Development fallback: Use placeholder image
            if (this.isDevelopmentMode() && error.message.includes('CORS')) {
                console.log('🚧 CORS error in development, using placeholder');
                return ['https://picsum.photos/1024/1024?random=' + Math.floor(Math.random() * 1000)];
            }
            
            // Provide helpful error message for CORS issues
            if (error.message.includes('CORS')) {
                throw new Error('CORS error: Image generation requires a proxy server. Please start the Supabase functions with: supabase functions serve');
            }
            
            throw error;
        }
    }

    /**
     * Poll Replicate prediction until completion
     */
    async pollPrediction(predictionId, maxAttempts = 30) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const prediction = await this.callReplicate(`predictions/${predictionId}`, null, { method: 'GET' });
                
                if (prediction.status === 'succeeded') {
                    return prediction.output;
                } else if (prediction.status === 'failed') {
                    throw new Error(`Generation failed: ${prediction.error}`);
                } else if (prediction.status === 'canceled') {
                    throw new Error('Generation was canceled');
                }
                
                // Wait before next poll (increasing delay)
                await new Promise(resolve => setTimeout(resolve, Math.min(1000 + attempt * 500, 5000)));
                
            } catch (error) {
                if (attempt === maxAttempts - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        throw new Error('Generation timed out');
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
    }

    /**
     * Clear all stored authentication data
     */
    clearAllData() {
        window.SecurityUtils.clearAllData();
        this.apiKeys.openai = null;
        this.apiKeys.replicate = null;
        this.updateKeyDisplays();
        this.showSuccess('All data cleared successfully');
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .api-key-set {
        background-color: #f0f9f0 !important;
        border-color: #10B981 !important;
    }
`;
document.head.appendChild(style);

// Create global instance
window.AuthManager = new AuthManager();
