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
        this.apiKeys.openai = SecurityUtils.getApiKey('openai');
        this.apiKeys.replicate = SecurityUtils.getApiKey('replicate');
        this.updateKeyDisplays();
    }

    /**
     * Set up event listeners for API key management
     */
    setupEventListeners() {
        document.getElementById('save-keys').addEventListener('click', () => {
            this.saveApiKeys();
        });

        // Auto-save on Enter key
        const keyInputs = ['openai-key', 'replicate-key'];
        keyInputs.forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveApiKeys();
                }
            });
        });
    }

    /**
     * Save API keys securely
     */
    saveApiKeys() {
        const openaiKey = document.getElementById('openai-key').value.trim();
        const replicateKey = document.getElementById('replicate-key').value.trim();
        
        try {
            // Validate keys
            if (openaiKey && !SecurityUtils.validateApiKey('openai', openaiKey)) {
                throw new Error('Invalid OpenAI API key format');
            }
            
            if (replicateKey && !SecurityUtils.validateApiKey('replicate', replicateKey)) {
                throw new Error('Invalid Replicate API key format');
            }

            // Store keys
            if (openaiKey) {
                SecurityUtils.storeApiKey('openai', openaiKey);
                this.apiKeys.openai = openaiKey;
            }
            
            if (replicateKey) {
                SecurityUtils.storeApiKey('replicate', replicateKey);
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
     * Update key status displays
     */
    updateKeyDisplays() {
        const openaiInput = document.getElementById('openai-key');
        const replicateInput = document.getElementById('replicate-key');
        
        if (this.apiKeys.openai) {
            openaiInput.placeholder = `OpenAI: ${SecurityUtils.maskApiKey(this.apiKeys.openai)}`;
            openaiInput.classList.add('api-key-set');
        } else {
            openaiInput.placeholder = 'OpenAI API Key';
            openaiInput.classList.remove('api-key-set');
        }
        
        if (this.apiKeys.replicate) {
            replicateInput.placeholder = `Replicate: ${SecurityUtils.maskApiKey(this.apiKeys.replicate)}`;
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
        return this.apiKeys.openai && this.apiKeys.replicate;
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
            SecurityUtils.checkRateLimit('openai', 60); // 60 calls per minute

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
     * Make authenticated API call to Replicate
     */
    async callReplicate(endpoint, data, options = {}) {
        if (!this.apiKeys.replicate) {
            throw new Error('Replicate API key not configured');
        }

        try {
            SecurityUtils.checkRateLimit('replicate', 30); // 30 calls per minute

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
     * Generate image using Replicate
     */
    async generateImage(prompt, options = {}) {
        const defaultOptions = {
            width: 1024,
            height: 1024,
            num_inference_steps: 20,
            guidance_scale: 7.5,
            prompt_strength: 0.8,
            scheduler: "DPMSolverMultistep"
        };

        const generationData = {
            input: {
                prompt: prompt,
                negative_prompt: "low quality, blurry, text, watermark, logo, brand names, letters, words, writing, signature, copyright, ugly, distorted",
                ...defaultOptions,
                ...options
            }
        };

        try {
            // Start prediction
            const prediction = await this.callReplicate('predictions', generationData);
            
            // Poll for completion
            return await this.pollPrediction(prediction.id);
            
        } catch (error) {
            console.error('Image generation failed:', error);
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
        SecurityUtils.clearAllData();
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
