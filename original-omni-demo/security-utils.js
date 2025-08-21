// Security utilities for safe DOM manipulation
// SECURITY FIX: Prevent XSS attacks with safe DOM methods

class SecurityUtils {
  /**
   * Safely set text content (prevents XSS)
   * @param {HTMLElement} element 
   * @param {string} text 
   */
  static safeSetText(element, text) {
    if (!element) return;
    element.textContent = text || '';
  }

  /**
   * Safely set HTML content with sanitization
   * @param {HTMLElement} element 
   * @param {string} html 
   */
  static safeSetHTML(element, html) {
    if (!element) return;
    
    // Basic HTML sanitization - remove script tags and event handlers
    const sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '');
    
    element.innerHTML = sanitized;
  }

  /**
   * Safely create and append elements
   * @param {string} tagName 
   * @param {string} textContent 
   * @param {string} className 
   * @returns {HTMLElement}
   */
  static createElement(tagName, textContent = '', className = '') {
    const element = document.createElement(tagName);
    if (textContent) element.textContent = textContent;
    if (className) element.className = className;
    return element;
  }

  /**
   * Validate email format
   * @param {string} email 
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Cloudwalk domain
   * @param {string} email 
   * @returns {boolean}
   */
  static isCloudwalkEmail(email) {
    return this.isValidEmail(email) && email.endsWith('@cloudwalk.io');
  }

  /**
   * Generate secure random string for tokens
   * @param {number} length 
   * @returns {string}
   */
  static generateSecureToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Safely store sensitive data (with enhanced obfuscation)
   * @param {string} key 
   * @param {string} value 
   */
  static secureStore(key, value) {
    try {
      // Enhanced obfuscation - multiple layers
      const timestamp = Date.now();
      const random = this.generateSecureToken(8);
      const xorKey = timestamp.toString().padStart(16, '0');
      
      // Simple XOR obfuscation
      let obfuscated = '';
      for (let i = 0; i < value.length; i++) {
        const charCode = value.charCodeAt(i) ^ xorKey.charCodeAt(i % xorKey.length);
        obfuscated += String.fromCharCode(charCode);
      }
      
      const encoded = btoa(JSON.stringify({
        data: btoa(obfuscated),
        salt: random,
        timestamp: timestamp
      }));
      
      sessionStorage.setItem(key, encoded);
    } catch (e) {
      console.error('Failed to store data:', e);
    }
  }

  /**
   * Safely retrieve sensitive data
   * @param {string} key 
   * @returns {string|null}
   */
  static secureRetrieve(key) {
    try {
      const encoded = sessionStorage.getItem(key);
      if (!encoded) return null;
      
      const decoded = JSON.parse(atob(encoded));
      if (!decoded.data || !decoded.timestamp) {
        // Try old format for backward compatibility
        const oldDecoded = atob(encoded);
        const [value] = oldDecoded.split('_');
        return value;
      }
      
      const xorKey = decoded.timestamp.toString().padStart(16, '0');
      const obfuscated = atob(decoded.data);
      
      // Reverse XOR obfuscation
      let value = '';
      for (let i = 0; i < obfuscated.length; i++) {
        const charCode = obfuscated.charCodeAt(i) ^ xorKey.charCodeAt(i % xorKey.length);
        value += String.fromCharCode(charCode);
      }
      
      return value;
    } catch (e) {
      console.error('Failed to retrieve data:', e);
      return null;
    }
  }

  /**
   * Clear sensitive data from storage
   * @param {string} key 
   */
  static secureClear(key) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
}

// Export for use in other files
window.SecurityUtils = SecurityUtils;

// Provide global safe methods
window.safeSetText = SecurityUtils.safeSetText;
window.safeSetHTML = SecurityUtils.safeSetHTML;
