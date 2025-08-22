/**
 * Simple Prompt Building System - Let the LLM do the work!
 * Just generates randomized characteristics and passes everything to LLM
 */

class PromptBuilder {
    constructor() {
        // Global style/mood prompt (editable via UI)
        this.globalStylePrompt = `The overall mood conveys digital modernity, professionalism, and trust.
Shot on a full-frame mirrorless camera — like a Sony A7R IV with a 50mm f/1.4 prime lens — producing shallow depth of field, smooth bokeh, and clean color balance, accented by pops of localized saturation (fabric textures, boutique details, totem display). Naturalistic documentary style with handheld or steady eye-level framing, realistic skin tones with natural texture, soft shadows with gentle falloff, slight halation around highlights. Fine cinematic softness without digital sharpness, subtle film grain overlay, high dynamic range, and tactile surface detail on real-world textures like linen fabric, wood, and glass. Minor lens bloom and edge vignette for an authentic cinematic feel.`;

        // Time of day variations
        this.timesOfDay = [
            'Afternoon sunlight',
            'Morning golden hour', 
            'Soft evening light',
            'Natural daylight',
            'Warm indoor lighting',
            'Bright morning',
            'Golden sunset',
            'Overcast soft lighting'
        ];

        // Ethnicities (global)
        this.ethnicities = [
            'Black woman in her mid-30s',
            'Hispanic man in his 40s', 
            'Asian woman in her 20s',
            'White man in his 30s',
            'Mixed-race woman in her 40s',
            'Middle Eastern man in his 30s',
            'Black man in his 20s',
            'Latino woman in her 30s',
            'South Asian woman in her 30s',
            'White woman in her 40s',
            'Indigenous person in their 30s',
            'East Asian man in his 20s'
        ];

        // Clothing colors with weighted distribution (60% earth, 20% black, 20% white)
        this.clothingColors = {
            earthTones: [
                'muted earthy-toned',
                'warm brown',
                'soft beige', 
                'olive green',
                'terracotta',
                'dusty rose',
                'sage green',
                'cream colored',
                'warm taupe',
                'burnt orange'
            ],
            black: [
                'black',
                'charcoal black',
                'deep black',
                'matte black'
            ],
            white: [
                'white',
                'off-white',
                'cream white',
                'pure white'
            ]
        };
    }

    /**
     * Generate randomized characteristics based on seed (60% earth, 20% black, 20% white)
     */
    getSeededCharacteristics(seed) {
        // Use seed for consistent randomization
        const timeIndex = seed % this.timesOfDay.length;
        const ethnicityIndex = Math.floor(seed / 10) % this.ethnicities.length;
        const clothingColorSeed = Math.floor(seed / 100);
        
        // Weighted clothing color distribution using seed
        const clothingRand = (clothingColorSeed % 100) / 100;
        let clothingColor;
        
        if (clothingRand < 0.6) {
            // 60% earth tones
            const earthIndex = Math.floor(clothingColorSeed / 1000) % this.clothingColors.earthTones.length;
            clothingColor = this.clothingColors.earthTones[earthIndex];
        } else if (clothingRand < 0.8) {
            // 20% black
            const blackIndex = Math.floor(clothingColorSeed / 1000) % this.clothingColors.black.length;
            clothingColor = this.clothingColors.black[blackIndex];
        } else {
            // 20% white
            const whiteIndex = Math.floor(clothingColorSeed / 1000) % this.clothingColors.white.length;
            clothingColor = this.clothingColors.white[whiteIndex];
        }

        return {
            timeOfDay: this.timesOfDay[timeIndex],
            ethnicity: this.ethnicities[ethnicityIndex],
            clothingColor: clothingColor
        };
    }

    /**
     * Build simple input for LLM - let it figure out the rest!
     */
    buildLLMInput(productPrompt, mccCode, seed, globalStylePrompt = null) {
        const characteristics = this.getSeededCharacteristics(seed);
        const stylePrompt = globalStylePrompt || this.globalStylePrompt;
        
        return {
            mccCode: mccCode,
            productPrompt: productPrompt,
            timeOfDay: characteristics.timeOfDay,
            ethnicity: characteristics.ethnicity,
            clothingColor: characteristics.clothingColor,
            globalStylePrompt: stylePrompt
        };
    }

    /**
     * Generate LLM instructions - simple and effective
     */
    getLLMInstructions() {
        return `You are a professional prompt engineer. Create a high-quality image generation prompt by combining the provided elements.

Here's your example based on the original prompt they showed me:

EXAMPLE:
MCC Code: 5651 (Clothing Store)
Product Prompt: "Hero portrait of the subject holding her smartphone firmly in her right hand, the device angled slightly downward with the screen facing a digital totem display on the counter."
Time of Day: Afternoon sunlight
Ethnicity: Black woman in her mid-30s  
Clothing Color: muted earthy-toned
Global Style: "The overall mood conveys digital modernity, professionalism, and trust. Shot on a full-frame mirrorless camera..."

OUTPUT: "Afternoon sunlight inside a boutique (modern fashion environment, no visible signs). A Black woman in her mid-30s, wearing muted earthy-toned, aligned with the environment professional casual clothing, stands at the cashier counter. In the background, softly blurred mannequins, racks of clothing, and boutique lights frame the space. Hero portrait of the subject holding her smartphone firmly in her right hand, the device angled slightly downward with the screen facing a digital totem display on the counter. She positions the phone just a few centimeters from the scanner, simulating a digital interaction. Her gaze is directed at her phone screen, expression focused but calm, posture upright with a subtle forward lean, suggesting confidence and efficiency. The overall mood conveys digital modernity, professionalism, and trust. Shot on a full-frame mirrorless camera — like a Sony A7R IV with a 50mm f/1.4 prime lens — producing shallow depth of field, smooth bokeh, and clean color balance, accented by pops of localized saturation (fabric textures, boutique details, totem display). Naturalistic documentary style with handheld or steady eye-level framing, realistic skin tones with natural texture, soft shadows with gentle falloff, slight halation around highlights."

RULES:
- Use the MCC code to determine appropriate business environment (restaurant, retail store, clinic, etc.)
- Integrate the time of day, ethnicity, and clothing color naturally
- Include the product prompt as the main action/focus
- Add the global style prompt for technical specifications
- Create a cohesive, professional prompt
- No visible text, logos, or signs
- Maximum 600 characters if possible

Generate the final prompt using the provided components:`;
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
