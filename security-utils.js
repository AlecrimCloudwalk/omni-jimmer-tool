/**
 * Security utilities for API key management and secure operations
 */

class SecurityUtils {
    constructor() {
        this.keyPrefix = 'omni_jimmer_';
        this.encryptionKey = this.generateKey();
    }

    /**
     * Generate a simple encryption key from browser fingerprint
     */
    generateKey() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Omni Jimmer Security', 2, 2);
        
        return canvas.toDataURL().slice(-16);
    }

    /**
     * Simple XOR encryption for local storage
     */
    encrypt(text, key = this.encryptionKey) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return btoa(result);
    }

    /**
     * Simple XOR decryption
     */
    decrypt(encryptedText, key = this.encryptionKey) {
        try {
            const decoded = atob(encryptedText);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(
                    decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            return result;
        } catch (e) {
            console.warn('Failed to decrypt data');
            return null;
        }
    }

    /**
     * Securely store API key
     */
    storeApiKey(provider, key) {
        if (!key || key.length < 10) {
            throw new Error('Invalid API key');
        }
        
        const encrypted = this.encrypt(key);
        localStorage.setItem(`${this.keyPrefix}${provider}`, encrypted);
        
        // Clear from memory after storage
        key = null;
    }

    /**
     * Retrieve and decrypt API key
     */
    getApiKey(provider) {
        const stored = localStorage.getItem(`${this.keyPrefix}${provider}`);
        if (!stored) return null;
        
        return this.decrypt(stored);
    }

    /**
     * Remove stored API key
     */
    removeApiKey(provider) {
        localStorage.removeItem(`${this.keyPrefix}${provider}`);
    }

    /**
     * Validate API key format
     */
    validateApiKey(provider, key) {
        if (!key) return false;
        
        switch (provider) {
            case 'openai':
                return key.startsWith('sk-') && key.length > 20;
            case 'replicate':
                return /^r8_[a-zA-Z0-9]{40}$/.test(key);
            default:
                return key.length > 10;
        }
    }

    /**
     * Mask API key for display
     */
    maskApiKey(key) {
        if (!key || key.length < 8) return '';
        return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
    }

    /**
     * Sanitize user input to prevent XSS
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .replace(/[<>\"'&]/g, (match) => {
                const escapeMap = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                };
                return escapeMap[match];
            })
            .trim()
            .substring(0, 500); // Limit length
    }

    /**
     * Validate CNAE code format
     */
    validateCnaeCode(code) {
        // Brazilian CNAE format: XXXX-X (4 digits, dash, 1 digit)
        return /^\d{4}-\d$/.test(code);
    }

    /**
     * Generate secure session ID for tracking
     */
    generateSessionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `${timestamp}-${random}`;
    }

    /**
     * Rate limiting for API calls
     */
    checkRateLimit(operation, maxPerMinute = 10) {
        const key = `rate_${operation}`;
        const now = Date.now();
        const minute = 60 * 1000;
        
        let calls = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Remove calls older than 1 minute
        calls = calls.filter(time => now - time < minute);
        
        if (calls.length >= maxPerMinute) {
            const oldestCall = Math.min(...calls);
            const waitTime = Math.ceil((oldestCall + minute - now) / 1000);
            throw new Error(`Rate limit exceeded. Wait ${waitTime} seconds.`);
        }
        
        calls.push(now);
        localStorage.setItem(key, JSON.stringify(calls));
        
        return true;
    }

    /**
     * Clear all stored data
     */
    clearAllData() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.keyPrefix) || key.startsWith('rate_')) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Create global instance
window.SecurityUtils = new SecurityUtils();
