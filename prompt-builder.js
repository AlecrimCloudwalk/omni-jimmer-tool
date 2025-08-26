/**
 * Global Style Prompt Manager - Brazilian Content Generation
 * Provides the global style prompt used by the Brazilian content generation system
 */

class PromptBuilder {
    constructor() {
        // Global style/mood prompt (editable via UI) - Brazilian camera settings
        this.globalStylePrompt = `O clima geral transmite modernidade digital, profissionalismo e confiança. Capturado com uma câmera full-frame e lente 50mm f/1.4, resultando em profundidade de campo rasa, bokeh suave e cores equilibradas, com tons terrosos suaves e pequenos destaques de saturação (texturas de tecido, detalhes de boutique, totem de exposição). Estilo documental naturalista, com enquadramento na altura dos olhos, tons de pele realistas, sombras suaves e quedas de luz delicadas. Leve suavidade cinematográfica, granulação sutil, alto alcance dinâmico e sensação tátil em superfícies como linho.`;
    }

    /**
     * Update global style prompt
     */
    updateGlobalStylePrompt(newStylePrompt) {
        this.globalStylePrompt = newStylePrompt;
    }

    /**
     * Get current global style prompt
     */
    getGlobalStylePrompt() {
        return this.globalStylePrompt;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptBuilder;
} else {
    window.PromptBuilder = PromptBuilder;
}