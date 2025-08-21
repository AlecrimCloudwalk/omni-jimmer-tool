/**
 * Sample configuration file for Omni Jimmer Tool
 * Copy this to config.js and update with your settings
 */

const config = {
    // Deployment settings
    deployment: {
        baseUrl: 'https://your-domain.com',
        apiProxy: false, // Set to true if using a proxy for API calls
        environment: 'production' // 'development' or 'production'
    },

    // Default matrix configuration
    defaults: {
        // Maximum number of concurrent generations
        maxConcurrentGenerations: 3,
        
        // Rate limiting (requests per minute)
        rateLimits: {
            openai: 60,
            replicate: 30
        },

        // Image generation settings
        imageGeneration: {
            width: 1024,
            height: 1024,
            quality: 'high',
            model: 'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478'
        },

        // Default CNAEs (can be modified in UI)
        cnaes: [
            { code: '7311-4', name: 'Agências de publicidade' },
            { code: '4713-0', name: 'Lojas de departamentos' },
            { code: '5611-2', name: 'Restaurantes e similares' },
            // Add more as needed
        ],

        // Default product types (can be modified in UI)
        products: [
            { name: 'Top View Product', prompt: 'Professional top-view product shot on clean white background' },
            { name: 'Handshake Deal', prompt: 'Two business professionals shaking hands in modern office environment' },
            // Add more as needed
        ]
    },

    // UI settings
    ui: {
        theme: 'light', // 'light' or 'dark'
        animations: true,
        autoSave: true,
        showTooltips: true
    },

    // Analytics and tracking (optional)
    analytics: {
        enabled: false,
        trackingId: 'GA_TRACKING_ID',
        events: {
            trackGenerations: true,
            trackErrors: true,
            trackUsage: true
        }
    },

    // Feature flags
    features: {
        videoGeneration: false, // Coming soon
        batchDownload: true,
        advancedPrompting: true,
        customModels: false
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.Config = config;
}
