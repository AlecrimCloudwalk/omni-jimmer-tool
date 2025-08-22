// Development Setup - Auto-load API keys for local testing
// This file is only used during local development

(function() {
    'use strict';
    
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.port !== '';
    
    if (!isDevelopment) {
        console.log('🚀 Production mode - skipping dev setup');
        return;
    }

    console.log('🔧 Development mode detected - initializing dev setup...');
    
    // Wait for DOM and other scripts to load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (window.app && window.app.authManager) {
                console.log('🔑 Auto-loading development API keys...');
                
                // The keys will be auto-loaded by the AuthManager's loadDevelopmentKeys method
                window.app.authManager.loadStoredKeys();
                
                // Show helpful development info
                const devInfo = document.createElement('div');
                devInfo.style.cssText = `
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background: rgba(193, 247, 50, 0.1);
                    border: 1px solid rgba(193, 247, 50, 0.3);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #c1f732;
                    z-index: 9999;
                    font-family: monospace;
                `;
                devInfo.innerHTML = '🔧 DEV MODE - API keys auto-loaded';
                document.body.appendChild(devInfo);
                
                // Auto-remove after 3 seconds
                setTimeout(() => {
                    if (devInfo.parentNode) {
                        devInfo.parentNode.removeChild(devInfo);
                    }
                }, 3000);
                
            } else {
                console.warn('⚠️  AuthManager not available for dev key loading');
            }
        }, 1000);
    });
})();
