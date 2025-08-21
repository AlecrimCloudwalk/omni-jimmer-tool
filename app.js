/**
 * Main application logic for Omni Jimmer Tool
 */

class OmniJimmerApp {
    constructor() {
        this.cnaes = [];
        this.products = [];
        this.matrixData = {};
        this.generationQueue = [];
        this.isGenerating = false;
        this.currentSlide = 0;
        this.carouselData = [];
        this.maxMatrixSize = 15; // 15x15 maximum
        this.productSeeds = {}; // Store seeds for each product

        // Brazilian characteristics for random generation (original from omni-demo)
        this.brazilianCharacteristics = {
            ethnicities: [
                'parda, pele morena, traços mistos',
                'negra, pele escura, traços afrodescendentes',
                'branca, pele clara, traços europeus',
                'morena, pele bronzeada, traços brasileiros típicos',
                'negra retinta, pele bem escura, cabelos crespos',
                'parda clara, pele amorenada, cabelos ondulados',
                'asiática, descendente japonesa, traços orientais',
                'indígena, traços nativos brasileiros',
                'mulata, pele dourada, traços afro-brasileiros',
                'cafuza, mistura indígena e africana, pele acobreada'
            ],
            cities: [
                'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
                'Belo Horizonte', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém',
                'Goiânia', 'Campinas', 'São Luís', 'Maceió', 'Natal'
            ],
            timesOfDay: [
                'Amanhecer', 'Meio-dia ensolarado', 'Final de tarde', 'Anoitecer', 'Noite'
            ],
            environments: [
                'escritório moderno', 'ambiente comercial', 'espaço corporativo',
                'loja contemporânea', 'ambiente profissional', 'estabelecimento limpo'
            ]
        };

        this.initializeDefaults();
        this.setupEventListeners();
        this.loadStoredData();
        this.renderMatrix();
    }

    /**
     * Initialize with default CNAEs and products
     */
    initializeDefaults() {
        // Default CNAEs (Brazilian business classifications) - 12 specific ones
        this.defaultCnaes = [
            { name: 'Restaurante' },
            { name: 'Loja de Roupa' },
            { name: 'Loja de Móvel' },
            { name: 'Oficina Automotiva' },
            { name: 'Clínicas / Odonto / Estética' },
            { name: 'Salão de Beleza' },
            { name: 'Tatuagem' },
            { name: 'Mercadinho' },
            { name: 'Driver / Uber' },
            { name: 'Loja de Eletrônico' },
            { name: 'Material Construção' },
            { name: 'Guia Turismo' }
        ];

        // Default product types
        this.defaultProducts = [
            { name: 'Top View Product', prompt: 'Professional top-view product shot on clean white background' },
            { name: 'Handshake Deal', prompt: 'Two business professionals shaking hands in modern office environment' },
            { name: 'Team Meeting', prompt: 'Diverse team of Brazilian professionals in collaborative meeting' },
            { name: 'Service in Action', prompt: 'Professional providing service to client in clean environment' },
            { name: 'Product Display', prompt: 'Elegant product display in professional commercial setting' },
            { name: 'Customer Interaction', prompt: 'Friendly customer service interaction in Brazilian business context' },
            { name: 'Workplace Environment', prompt: 'Modern Brazilian workplace with diverse professionals working' },
            { name: 'Quality Assurance', prompt: 'Professional quality control and inspection process' },
            { name: 'Innovation Scene', prompt: 'Innovation and technology being used in Brazilian business' },
            { name: 'Client Presentation', prompt: 'Professional presenting to engaged clients in modern setting' },
            { name: 'Success Celebration', prompt: 'Team celebrating business success in Brazilian corporate environment' }
        ];
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // New generation buttons
        const generateAllRowBtn = document.getElementById('generate-all-row');
        const generateAllColBtn = document.getElementById('generate-all-col');
        
        if (generateAllRowBtn) {
            generateAllRowBtn.addEventListener('click', () => this.generateAllByRows());
            console.log('✅ Generate all by rows button listener added');
        }
        
        if (generateAllColBtn) {
            generateAllColBtn.addEventListener('click', () => this.generateAllByColumns());
            console.log('✅ Generate all by columns button listener added');
        }

        // Export/Import functionality
        const exportBtn = document.getElementById('export-config');
        const importBtn = document.getElementById('import-config');
        const downloadBtn = document.getElementById('download-all-images');
        const importFile = document.getElementById('import-file');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportConfiguration());
            console.log('✅ Export button listener added');
        }
        
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => this.importConfiguration(e));
            console.log('✅ Import functionality added');
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadAllImages());
            console.log('✅ Download all images button listener added');
        }

        // Demo carousel
        document.getElementById('demo-cnae-select').addEventListener('change', (e) => this.loadDemoCarousel(e.target.value));
        document.getElementById('prev-slide').addEventListener('click', () => this.previousSlide());
        document.getElementById('next-slide').addEventListener('click', () => this.nextSlide());

        // Keyboard navigation for carousel
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.phone-demo')) {
                if (e.key === 'ArrowLeft') this.previousSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });
    }

    /**
     * Load stored data from localStorage
     */
    loadStoredData() {
        const storedCnaes = localStorage.getItem('omni_jimmer_cnaes');
        const storedProducts = localStorage.getItem('omni_jimmer_products');
        const storedMatrix = localStorage.getItem('omni_jimmer_matrix');
        const storedSeeds = localStorage.getItem('omni_jimmer_seeds');

        if (storedCnaes) {
            this.cnaes = JSON.parse(storedCnaes);
        } else {
            this.cnaes = [...this.defaultCnaes];
        }

        if (storedProducts) {
            this.products = JSON.parse(storedProducts);
        } else {
            this.products = [...this.defaultProducts];
        }

        if (storedMatrix) {
            this.matrixData = JSON.parse(storedMatrix);
        }

        if (storedSeeds) {
            this.productSeeds = JSON.parse(storedSeeds);
        }

        this.updateDemoSelector();
    }

    /**
     * Save data to localStorage
     */
    saveData() {
        localStorage.setItem('omni_jimmer_cnaes', JSON.stringify(this.cnaes));
        localStorage.setItem('omni_jimmer_products', JSON.stringify(this.products));
        localStorage.setItem('omni_jimmer_matrix', JSON.stringify(this.matrixData));
        localStorage.setItem('omni_jimmer_seeds', JSON.stringify(this.productSeeds));
    }



    /**
     * Remove CNAE
     */
    removeCnae(name) {
        this.cnaes = this.cnaes.filter(cnae => cnae.name !== name);
        
        // Clean up matrix data
        Object.keys(this.matrixData).forEach(key => {
            if (key.includes(`-${name}`)) {
                delete this.matrixData[key];
            }
        });
        
        this.renderMatrix();
        this.updateDemoSelector();
        this.saveData();
        
        this.showMessage(`Removed CNAE: ${name}`, 'success');
    }



    /**
     * Show message with fallback to alert
     */
    showMessage(message, type = 'info') {
        if (window.AuthManager && AuthManager.showNotification) {
            if (type === 'error') {
                AuthManager.showError(message);
            } else if (type === 'success') {
                AuthManager.showSuccess(message);
            } else {
                AuthManager.showNotification(message, type);
            }
        } else {
            // Fallback to alert if AuthManager is not available
            console.log(`${type.toUpperCase()}: ${message}`);
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }

    /**
     * Check if required API keys are available
     */
    hasRequiredKeys() {
        if (window.AuthManager && AuthManager.hasRequiredKeys) {
            return AuthManager.hasRequiredKeys();
        }
        // For now, return true to allow testing without API keys
        return true;
    }

    /**
     * Get or create a seed for a product
     */
    getProductSeed(productName) {
        if (!this.productSeeds[productName]) {
            this.productSeeds[productName] = Math.floor(Math.random() * 10000);
            this.saveData();
        }
        return this.productSeeds[productName];
    }

    /**
     * Generate new seed for a product
     */
    reseedProduct(productName) {
        this.productSeeds[productName] = Math.floor(Math.random() * 10000);
        this.saveData();
        this.renderMatrix();
        this.showMessage(`New seed generated for ${productName}`, 'success');
    }

    /**
     * Update dynamic info display for a product
     */
    updateDynamicInfo(productName) {
        // Just re-render the matrix to update the dynamic info display
        this.renderMatrix();
        this.showMessage(`Dynamic info updated for ${productName}`, 'info');
    }

    /**
     * Generate prompt only for a specific cell
     */
    async generatePromptForCell(cellKey) {
        const [productName, cnaeName] = cellKey.split('-');
        const product = this.products.find(p => p.name === productName);
        const cnae = this.cnaes.find(c => c.name === cnaeName);
        
        if (!product || !cnae) {
            this.showMessage('Invalid cell reference', 'error');
            return;
        }

        try {
            const finalPrompt = await this.generateFinalPrompt(product.name, product.prompt, cnae);
            
            // Store prompt in matrix data
            this.matrixData[cellKey] = {
                status: 'prompt_ready',
                prompt: finalPrompt,
                product: product.name,
                cnae: cnae.name,
                generatedAt: new Date().toISOString()
            };
            
            this.renderMatrix();
            this.saveData();
            this.showMessage(`Prompt generated for ${product.name} - ${cnae.name}`, 'success');
            
        } catch (error) {
            console.error('Prompt generation failed:', error);
            this.showMessage(`Prompt generation failed: ${error.message}`, 'error');
        }
    }

    /**
     * Generate image from existing prompt
     */
    async generateImageFromPrompt(cellKey) {
        const cellData = this.matrixData[cellKey];
        if (!cellData || !cellData.prompt) {
            this.showMessage('No prompt found for this cell', 'error');
            return;
        }

        this.matrixData[cellKey].status = 'generating';
        this.renderMatrix();
        this.saveData();

        try {
            const imageOutput = await AuthManager.generateImage(cellData.prompt);
            const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;

            this.matrixData[cellKey] = {
                ...cellData,
                status: 'generated',
                imageUrl: imageUrl,
                generatedAt: new Date().toISOString()
            };

            this.renderMatrix();
            this.saveData();
            this.updateCarouselIfNeeded(cellData.cnae);
            
        } catch (error) {
            console.error('Image generation failed:', error);
            this.matrixData[cellKey] = { 
                ...cellData,
                status: 'error',
                error: error.message 
            };
            this.renderMatrix();
            this.saveData();
            this.showMessage(`Image generation failed: ${error.message}`, 'error');
        }
    }

    /**
     * Open cell modal for editing
     */
    openCellModal(cellKey) {
        this.currentCellKey = cellKey;
        const [productName, cnaeName] = cellKey.split('-');
        const cellData = this.matrixData[cellKey];
        
        // Update modal title
        document.getElementById('modal-title').textContent = `${productName} - ${cnaeName}`;
        
        // Setup modal content based on cell state
        this.setupModalContent(cellData);
        
        // Show modal
        document.getElementById('cell-modal').style.display = 'flex';
        
        // Setup event listeners for modal buttons
        this.setupModalEventListeners();
    }

    /**
     * Setup modal content based on cell state
     */
    setupModalContent(cellData) {
        const promptEditor = document.getElementById('prompt-editor');
        const imagePreview = document.getElementById('image-preview');
        const characteristicsDiv = document.getElementById('dynamic-characteristics');
        
        // Get product name from current cell key
        const [productName, cnaeName] = this.currentCellKey.split('-');
        
        // Show dynamic characteristics (read-only)
        const seedInfo = this.getSeededCharacteristics(this.getProductSeed(productName));
        characteristicsDiv.textContent = `${seedInfo.ethnicity}, ${seedInfo.city}, ${seedInfo.timeOfDay}`;
        
        // Reset workflow steps
        this.resetWorkflowSteps();
        
        if (cellData) {
            if (cellData.prompt) {
                promptEditor.value = cellData.prompt;
                promptEditor.readonly = true;
                this.setWorkflowStepCompleted(1);
                this.enableGenerateImage();
            }
            
            if (cellData.imageUrl) {
                imagePreview.innerHTML = `<img src="${cellData.imageUrl}" alt="Generated image">`;
                this.setWorkflowStepCompleted(2);
                document.getElementById('regenerate-image-btn').style.display = 'inline-block';
            }
            
            if (cellData.status === 'generating') {
                this.setWorkflowStepGenerating(2);
            }
            
            if (cellData.status === 'error') {
                this.setWorkflowStepError(cellData.status === 'prompt_ready' ? 2 : 1);
            }
        } else {
            promptEditor.value = '';
            promptEditor.readonly = true;
            imagePreview.innerHTML = '<div class="placeholder">Generated image will appear here</div>';
        }
    }

    /**
     * Setup modal event listeners
     */
    setupModalEventListeners() {
        // Remove existing listeners to avoid duplicates
        document.getElementById('generate-prompt-btn').onclick = () => this.modalGeneratePrompt();
        document.getElementById('edit-prompt-btn').onclick = () => this.modalEditPrompt();
        document.getElementById('save-prompt-btn').onclick = () => this.modalSavePrompt();
        document.getElementById('generate-image-btn').onclick = () => this.modalGenerateImage();
        document.getElementById('regenerate-image-btn').onclick = () => this.modalRegenerateImage();
    }

    /**
     * Edit prompt in modal
     */
    modalEditPrompt() {
        const promptEditor = document.getElementById('prompt-editor');
        const editBtn = document.getElementById('edit-prompt-btn');
        const saveBtn = document.getElementById('save-prompt-btn');
        
        promptEditor.readonly = false;
        promptEditor.focus();
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    }

    /**
     * Generate prompt from modal
     */
    async modalGeneratePrompt() {
        const btn = document.getElementById('generate-prompt-btn');
        btn.disabled = true;
        btn.textContent = 'Generating...';
        this.setWorkflowStepGenerating(1);
        
        try {
            await this.generatePromptForCell(this.currentCellKey);
            const cellData = this.matrixData[this.currentCellKey];
            if (cellData && cellData.prompt) {
                document.getElementById('prompt-editor').value = cellData.prompt;
                document.getElementById('prompt-editor').readonly = true;
                this.setWorkflowStepCompleted(1);
                this.enableGenerateImage();
            }
        } catch (error) {
            this.setWorkflowStepError(1);
            this.showMessage('Failed to generate prompt', 'error');
        }
        
        btn.disabled = false;
        btn.textContent = 'Generate Prompt';
    }

    /**
     * Save edited prompt from modal
     */
    modalSavePrompt() {
        const prompt = document.getElementById('prompt-editor').value.trim();
        const editBtn = document.getElementById('edit-prompt-btn');
        const saveBtn = document.getElementById('save-prompt-btn');
        
        if (!prompt) {
            this.showMessage('Prompt cannot be empty', 'error');
            return;
        }

        this.matrixData[this.currentCellKey] = {
            ...this.matrixData[this.currentCellKey],
            prompt: prompt,
            status: 'prompt_ready'
        };
        
        document.getElementById('prompt-editor').readonly = true;
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        
        this.renderMatrix();
        this.saveData();
        this.setWorkflowStepCompleted(1);
        this.enableGenerateImage();
        this.showMessage('Prompt saved successfully', 'success');
    }

    /**
     * Generate image from modal
     */
    async modalGenerateImage() {
        const btn = document.getElementById('generate-image-btn');
        btn.disabled = true;
        btn.textContent = 'Generating...';
        this.setWorkflowStepGenerating(2);
        
        try {
            await this.generateImageFromPrompt(this.currentCellKey);
            const cellData = this.matrixData[this.currentCellKey];
            if (cellData && cellData.imageUrl) {
                document.getElementById('image-preview').innerHTML = 
                    `<img src="${cellData.imageUrl}" alt="Generated image">`;
                this.setWorkflowStepCompleted(2);
                document.getElementById('regenerate-image-btn').style.display = 'inline-block';
            }
        } catch (error) {
            this.setWorkflowStepError(2);
            this.showMessage('Failed to generate image', 'error');
        }
        
        btn.disabled = false;
        btn.textContent = 'Generate Image';
    }

    /**
     * Regenerate image from modal
     */
    async modalRegenerateImage() {
        await this.modalGenerateImage();
    }

    /**
     * Reset workflow steps
     */
    resetWorkflowSteps() {
        for (let i = 1; i <= 3; i++) {
            const step = document.getElementById(`workflow-step-${i}`);
            step.className = 'workflow-step';
        }
        document.getElementById('generate-image-btn').disabled = true;
        document.getElementById('regenerate-image-btn').style.display = 'none';
        document.getElementById('edit-prompt-btn').style.display = 'inline-block';
        document.getElementById('save-prompt-btn').style.display = 'none';
    }

    /**
     * Set workflow step as completed
     */
    setWorkflowStepCompleted(stepNumber) {
        const step = document.getElementById(`workflow-step-${stepNumber}`);
        step.className = 'workflow-step completed';
    }

    /**
     * Set workflow step as generating
     */
    setWorkflowStepGenerating(stepNumber) {
        const step = document.getElementById(`workflow-step-${stepNumber}`);
        step.className = 'workflow-step generating';
    }

    /**
     * Set workflow step as error
     */
    setWorkflowStepError(stepNumber) {
        const step = document.getElementById(`workflow-step-${stepNumber}`);
        step.className = 'workflow-step error';
    }

    /**
     * Enable image generation
     */
    enableGenerateImage() {
        document.getElementById('generate-image-btn').disabled = false;
    }



    /**
     * Close cell modal
     */
    closeCellModal() {
        document.getElementById('cell-modal').style.display = 'none';
        this.currentCellKey = null;
    }

    /**
     * Delete cell data from modal
     */
    deleteCellData() {
        if (confirm('Are you sure you want to delete all data for this cell?')) {
            delete this.matrixData[this.currentCellKey];
            this.renderMatrix();
            this.saveData();
            this.closeCellModal();
            this.showMessage('Cell data deleted', 'success');
        }
    }

    /**
     * Generate column step (1=prompts, 2=images, 3=videos)
     */
    async generateColumnStep(cnaeName, step) {
        const cnaeProducts = this.products.filter(p => p.name); // Get all products
        
        if (step === 1) {
            // Generate all prompts for column
            let completed = 0;
            for (const product of cnaeProducts) {
                const cellKey = `${product.name}-${cnaeName}`;
                try {
                    await this.generatePromptForCell(cellKey);
                    completed++;
                } catch (error) {
                    console.error(`Failed to generate prompt for ${cellKey}:`, error);
                }
            }
            this.showMessage(`Generated ${completed}/${cnaeProducts.length} prompts for ${cnaeName}`, 'success');
            
        } else if (step === 2) {
            // Generate all images for column (only for cells with prompts)
            let completed = 0;
            for (const product of cnaeProducts) {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                if (cellData && cellData.prompt && cellData.status === 'prompt_ready') {
                    try {
                        await this.generateImageFromPrompt(cellKey);
                        completed++;
                    } catch (error) {
                        console.error(`Failed to generate image for ${cellKey}:`, error);
                    }
                }
            }
            this.showMessage(`Generated ${completed} images for ${cnaeName}`, 'success');
            
        } else if (step === 3) {
            // Video generation - coming soon
            this.showMessage('Video generation coming soon!', 'info');
        }
        
        this.renderMatrix();
    }

    /**
     * Generate row step (1=prompts, 2=images, 3=videos)
     */
    async generateRowStep(productName, step) {
        const product = this.products.find(p => p.name === productName);
        if (!product) return;
        
        if (step === 1) {
            // Generate all prompts for row
            let completed = 0;
            for (const cnae of this.cnaes) {
                const cellKey = `${productName}-${cnae.name}`;
                try {
                    await this.generatePromptForCell(cellKey);
                    completed++;
                } catch (error) {
                    console.error(`Failed to generate prompt for ${cellKey}:`, error);
                }
            }
            this.showMessage(`Generated ${completed}/${this.cnaes.length} prompts for ${productName}`, 'success');
            
        } else if (step === 2) {
            // Generate all images for row (only for cells with prompts)
            let completed = 0;
            for (const cnae of this.cnaes) {
                const cellKey = `${productName}-${cnae.name}`;
                const cellData = this.matrixData[cellKey];
                if (cellData && cellData.prompt && cellData.status === 'prompt_ready') {
                    try {
                        await this.generateImageFromPrompt(cellKey);
                        completed++;
                    } catch (error) {
                        console.error(`Failed to generate image for ${cellKey}:`, error);
                    }
                }
            }
            this.showMessage(`Generated ${completed} images for ${productName}`, 'success');
            
        } else if (step === 3) {
            // Video generation - coming soon
            this.showMessage('Video generation coming soon!', 'info');
        }
        
        this.renderMatrix();
    }

    /**
     * Shuffle characteristics for a product
     */
    shuffleProductCharacteristics(productName) {
        // Generate new seed for the product
        this.reseedProduct(productName);
        
        // Update the UI to show new characteristics
        this.renderMatrix();
        this.saveData();
        
        this.showMessage(`Shuffled characteristics for ${productName}`, 'success');
    }

    /**
     * Get Brazilian characteristics based on seed
     */
    getSeededCharacteristics(seed) {
        // Use seed to get consistent characteristics
        const ethnicityIndex = seed % this.brazilianCharacteristics.ethnicities.length;
        const cityIndex = Math.floor(seed / 10) % this.brazilianCharacteristics.cities.length;
        const timeIndex = Math.floor(seed / 100) % this.brazilianCharacteristics.timesOfDay.length;
        const environmentIndex = Math.floor(seed / 1000) % this.brazilianCharacteristics.environments.length;

        return {
            ethnicity: this.brazilianCharacteristics.ethnicities[ethnicityIndex],
            city: this.brazilianCharacteristics.cities[cityIndex],
            timeOfDay: this.brazilianCharacteristics.timesOfDay[timeIndex],
            environment: this.brazilianCharacteristics.environments[environmentIndex]
        };
    }

    /**
     * Build structured input for LLM prompt generation
     */
    buildStructuredInput(productName, basePrompt, cnae) {
        const seedInfo = this.getSeededCharacteristics(this.getProductSeed(productName));
        
        // Create structured input combining user prompt + Brazilian characteristics
        const structuredInput = `Scene: ${basePrompt}
Business: ${cnae.name}
Person: ${seedInfo.ethnicity}
Location: ${seedInfo.city}
Time: ${seedInfo.timeOfDay}
Environment: Interior de um ${cnae.name.toLowerCase()}
Profession: ${this.getProfessionFromCnae(cnae.name)}
Additional: Ambiente brasileiro, sem letreiros visíveis`;

        return structuredInput;
    }

    /**
     * Get profession description from CNAE name
     */
    getProfessionFromCnae(cnaeName) {
        const professionMap = {
            'Restaurante': 'garçom ou cozinheiro',
            'Loja de Roupa': 'vendedor de roupas',
            'Loja de Móvel': 'vendedor de móveis',
            'Oficina Automotiva': 'mecânico',
            'Clínicas / Odonto / Estética': 'profissional da saúde',
            'Salão de Beleza': 'cabeleireiro ou esteticista',
            'Tatuagem': 'tatuador',
            'Mercadinho': 'atendente de mercado',
            'Driver / Uber': 'motorista',
            'Loja de Eletrônico': 'vendedor de eletrônicos',
            'Material Construção': 'vendedor de materiais',
            'Guia Turismo': 'guia turístico'
        };
        return professionMap[cnaeName] || 'profissional';
    }

    /**
     * Generate final prompt using LLM
     */
    async generateFinalPrompt(productName, basePrompt, cnae) {
        const structuredInput = this.buildStructuredInput(productName, basePrompt, cnae);
        
        try {
            // Use AuthManager to call OpenAI for prompt generation
            const promptInstructions = `You are a professional prompt engineer. Convert the structured information into a high-quality image generation prompt.

Use these examples as guidance:

EXAMPLE 1 (Owner visible):
Input: "owner at storefront showing their business"
Output: "Brazilian restaurant owner standing proudly at their storefront, warm smile, pardo brasileiro, Belo Horizonte evening lighting, professional chef attire, traditional Brazilian restaurant facade, inviting atmosphere"

EXAMPLE 2 (No owner shown):
Input: "two hands making card payment" 
Output: "Close-up of hands making card payment transaction, Brazilian restaurant interior background, evening lighting, card reader and receipt, professional service interaction"

Key rules:
- If scene focuses on hands/objects/details: omit person descriptions
- If scene shows owner/people: include person characteristics
- Always include Brazilian context and location
- Make it flow naturally

Structured input:
${structuredInput}

Generate the final prompt:`;

            const finalPrompt = await AuthManager.enhancePrompt(promptInstructions, '', 'prompt_generation');
            return finalPrompt;
        } catch (error) {
            console.warn('LLM prompt generation failed, falling back to simple concatenation:', error);
            // Fallback to simple approach if LLM fails
            const seedInfo = this.getSeededCharacteristics(this.getProductSeed(productName));
            return `${basePrompt}. ${seedInfo.ethnicity} person in ${seedInfo.city}, during ${seedInfo.timeOfDay}, working in ${cnae.name}`;
        }
    }

    /**
     * Update CNAE inline
     */
    updateCnae(index, field, value) {
        if (index >= 0 && index < this.cnaes.length) {
            this.cnaes[index][field] = value.trim();
            this.saveData();
            this.updateDemoSelector();
            console.log(`Updated CNAE ${index} ${field} to: ${value}`);
        }
    }

    /**
     * Update Product inline
     */
    updateProduct(index, field, value) {
        if (index >= 0 && index < this.products.length) {
            const oldName = this.products[index].name;
            this.products[index][field] = value.trim();
            
            // If name changed, update matrix data keys and seed
            if (field === 'name' && oldName !== value.trim()) {
                this.updateMatrixKeysForProduct(oldName, value.trim());
                this.productSeeds[value.trim()] = this.productSeeds[oldName];
                delete this.productSeeds[oldName];
            }
            
            this.saveData();
            
            // Re-render matrix to show updated final prompt preview
            if (field === 'prompt') {
                this.renderMatrix();
            }
            
            console.log(`Updated Product ${index} ${field} to: ${value}`);
        }
    }

    /**
     * Update matrix data keys when product name changes
     */
    updateMatrixKeysForProduct(oldName, newName) {
        const newMatrixData = {};
        Object.keys(this.matrixData).forEach(key => {
            if (key.startsWith(oldName + '-')) {
                const newKey = key.replace(oldName + '-', newName + '-');
                newMatrixData[newKey] = this.matrixData[key];
            } else {
                newMatrixData[key] = this.matrixData[key];
            }
        });
        this.matrixData = newMatrixData;
    }

    /**
     * Add new CNAE inline
     */
    addCnaeInline() {
        const newName = prompt('Enter CNAE business type (e.g., Restaurante):');
        
        if (!newName) {
            this.showMessage('CNAE business type is required', 'error');
            return;
        }

        if (this.cnaes.some(cnae => cnae.name === newName.trim())) {
            this.showMessage('CNAE business type already exists', 'error');
            return;
        }

        if (this.cnaes.length >= this.maxMatrixSize) {
            this.showMessage(`Maximum ${this.maxMatrixSize} CNAEs allowed`, 'error');
            return;
        }

        this.cnaes.push({ name: newName.trim() });
        this.saveData();
        this.renderMatrix();
        this.updateDemoSelector();
        this.showMessage(`Added CNAE: ${newName}`, 'success');
    }

    /**
     * Add new Product inline
     */
    addProductInline() {
        const newName = prompt('Enter product name (e.g., Top View Product):');
        const newPrompt = prompt('Enter default prompt template:');
        
        if (!newName || !newPrompt) {
            this.showMessage('Both product name and prompt are required', 'error');
            return;
        }

        if (this.products.some(product => product.name === newName)) {
            this.showMessage('Product name already exists', 'error');
            return;
        }

        if (this.products.length >= this.maxMatrixSize) {
            this.showMessage(`Maximum ${this.maxMatrixSize} products allowed`, 'error');
            return;
        }

        this.products.push({ name: newName.trim(), prompt: newPrompt.trim() });
        this.saveData();
        this.renderMatrix();
        this.showMessage(`Added product: ${newName}`, 'success');
    }

    /**
     * Preview row generation - show prompts first
     */
    async previewRowGeneration(productName) {
        const product = this.products.find(p => p.name === productName);
        if (!product) return;
        
        const prompts = [];
        for (const cnae of this.cnaes) {
            const finalPrompt = await this.generateFinalPrompt(product.name, product.prompt, cnae);
            prompts.push(`${cnae.name}: ${finalPrompt}`);
        }
        
        const result = confirm(`Preview prompts for ${productName}:\n\n${prompts.join('\n\n')}\n\nGenerate images for this row?`);
        if (result) {
            await this.generateRow(productName);
        }
    }

    /**
     * Preview column generation - show prompts first
     */
    async previewColumnGeneration(cnaeName) {
        const cnae = this.cnaes.find(c => c.name === cnaeName);
        if (!cnae) return;
        
        const prompts = [];
        for (const product of this.products) {
            const finalPrompt = await this.generateFinalPrompt(product.name, product.prompt, cnae);
            prompts.push(`${product.name}: ${finalPrompt}`);
        }
        
        const result = confirm(`Preview prompts for ${cnaeName}:\n\n${prompts.join('\n\n')}\n\nGenerate images for this column?`);
        if (result) {
            await this.generateColumn(cnaeName);
        }
    }

    /**
     * Generate all by rows
     */
    async generateAllByRows() {
        this.showMessage('Generating all products by rows...', 'info');
        for (const product of this.products) {
            await this.generateRow(product.name);
        }
    }

    /**
     * Generate all by columns
     */
    async generateAllByColumns() {
        this.showMessage('Generating all CNAEs by columns...', 'info');
        for (const cnae of this.cnaes) {
            await this.generateColumn(cnae.name);
        }
    }

    /**
     * Remove product
     */
    removeProduct(name) {
        this.products = this.products.filter(product => product.name !== name);
        
        // Clean up matrix data
        Object.keys(this.matrixData).forEach(key => {
            if (key.startsWith(`${name}-`)) {
                delete this.matrixData[key];
            }
        });
        
        this.renderProductList();
        this.renderMatrix();
        this.saveData();
        
        this.showMessage(`Removed product: ${name}`, 'success');
    }



    /**
     * Render matrix in card-style layout
     */
    renderMatrix() {
        const container = document.getElementById('matrix-grid');
        container.innerHTML = '';

        if (this.cnaes.length === 0 || this.products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>📋 Matrix Empty</h3>
                    <p>Add CNAEs and Products to start generating content</p>
                </div>
            `;
            return;
        }

        // Create the card-style layout container
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'content-matrix';

        // Header row
        const headerRow = document.createElement('div');
        headerRow.className = 'matrix-header-row';
        
        // Empty spacer for product column
        const productSpacer = document.createElement('div');
        productSpacer.className = 'column-spacer';
        headerRow.appendChild(productSpacer);

        // Empty spacer for prompt column  
        const promptSpacer = document.createElement('div');
        promptSpacer.className = 'column-spacer';
        headerRow.appendChild(promptSpacer);

        // CNAE headers
        this.cnaes.forEach((cnae, index) => {
            const cnaeHeader = document.createElement('div');
            cnaeHeader.className = 'cnae-header-card';
            cnaeHeader.innerHTML = `
                <div class="cnae-step-buttons">
                    <button class="step-btn step-1" onclick="app.generateColumnStep('${cnae.name}', 1)" title="Generate all prompts">1</button>
                    <button class="step-btn step-2" onclick="app.generateColumnStep('${cnae.name}', 2)" title="Generate all images">2</button>
                    <button class="step-btn step-3" onclick="app.generateColumnStep('${cnae.name}', 3)" title="Generate all videos">3</button>
                </div>
                <h3>${cnae.name}</h3>
                <button class="cnae-remove-btn" onclick="app.removeCnae('${cnae.name}')" title="Remove CNAE">×</button>
            `;
            headerRow.appendChild(cnaeHeader);
        });

        matrixContainer.appendChild(headerRow);

        // Product rows
        this.products.forEach((product, productIndex) => {
            const productRow = document.createElement('div');
            productRow.className = 'product-row-card';
            
            // Product name column
            const productColumn = document.createElement('div');
            productColumn.className = 'product-column';
            productColumn.innerHTML = `
                <div class="product-step-buttons">
                    <button class="product-step-btn step-1" onclick="app.generateRowStep('${product.name}', 1)" title="Generate all prompts for row">1</button>
                    <button class="product-step-btn step-2" onclick="app.generateRowStep('${product.name}', 2)" title="Generate all images for row">2</button>
                    <button class="product-step-btn step-3" onclick="app.generateRowStep('${product.name}', 3)" title="Generate all videos for row">3</button>
                </div>
                <div class="product-name-display">${product.name}</div>
                <div class="product-controls">
                    <button class="control-btn shuffle" onclick="app.shuffleProductCharacteristics('${product.name}')" title="Shuffle">🔄</button>
                    <button class="control-btn-remove" onclick="app.removeProduct('${product.name}')" title="Remove">×</button>
                </div>
            `;
            productRow.appendChild(productColumn);

            // Prompt & Characteristics column
            const promptColumn = document.createElement('div');
            promptColumn.className = 'prompt-column';
            const seedInfo = this.getSeededCharacteristics(this.getProductSeed(product.name));
            promptColumn.innerHTML = `
                <textarea class="prompt-edit" 
                          placeholder="Enter prompt description..."
                          onblur="app.updateProduct(${productIndex}, 'prompt', this.value)"
                          onkeypress="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); this.blur(); }">${product.prompt || 'Professional top-view product shot on clean white background'}</textarea>
                <div class="characteristics-display">${seedInfo.ethnicity}, ${seedInfo.city}, ${seedInfo.timeOfDay}</div>
            `;
            productRow.appendChild(promptColumn);

            // CNAE result columns
            this.cnaes.forEach(cnae => {
                const cellKey = `${product.name}-${cnae.name}`;
                const cellData = this.matrixData[cellKey];
                
                const cnaeColumn = document.createElement('div');
                cnaeColumn.className = 'cnae-result-column';
                cnaeColumn.innerHTML = this.renderCnaeCell(cellKey, cellData, product, cnae);
                productRow.appendChild(cnaeColumn);
            });

            matrixContainer.appendChild(productRow);
        });

        container.appendChild(matrixContainer);
        
        console.log('✅ Matrix rendered in card layout');
    }

    /**
     * Render CNAE cell for card layout
     */
    renderCnaeCell(cellKey, cellData, product, cnae) {
        let statusClass = 'cell-empty';
        let content = 'Ready to generate';
        
        if (cellData) {
            if (cellData.status === 'generated' && cellData.imageUrl) {
                statusClass = 'cell-generated';
                content = `<img src="${cellData.imageUrl}" alt="${product.name} - ${cnae.name}" class="cell-image">`;
            } else if (cellData.status === 'generating') {
                statusClass = 'cell-generating';
                content = 'Generating...';
            } else if (cellData.status === 'prompt_ready') {
                statusClass = 'cell-prompt-ready';
                content = 'Ready to generate';
            } else if (cellData.status === 'error') {
                statusClass = 'cell-error';
                content = 'Generation failed';
            }
        }

        return `
            <div class="cnae-cell-content ${statusClass}" onclick="app.openCellModal('${cellKey}')">
                ${content}
            </div>
        `;
    }

    /**
     * Render individual matrix cell - simplified
     */
    renderMatrixCell(cellKey, cellData, product, cnae) {
        let statusClass = '';
        let content = '';
        let statusIcon = '';

        if (cellData) {
            if (cellData.status === 'generated' && cellData.imageUrl) {
                statusClass = 'generated';
                content = `<img src="${cellData.imageUrl}" alt="${product.name} - ${cnae.name}">`;
                statusIcon = '<div class="status-icon success">✓</div>';
            } else if (cellData.status === 'generating') {
                statusClass = 'generating';
                content = '<div class="spinner">⏳</div>';
                statusIcon = '<div class="status-icon generating">⏳</div>';
            } else if (cellData.status === 'prompt_ready') {
                statusClass = 'prompt-ready';
                content = '<div class="prompt-ready-icon">📝</div>';
                statusIcon = '<div class="status-icon ready">📝</div>';
            } else if (cellData.status === 'error') {
                statusClass = 'error';
                content = '<div class="error-icon">❌</div>';
                statusIcon = '<div class="status-icon error">❌</div>';
            }
        } else {
            content = '<div class="empty-icon">⭕</div>';
            statusIcon = '<div class="status-icon empty">⭕</div>';
        }

        return `
            <div class="matrix-cell ${statusClass}" onclick="app.openCellModal('${cellKey}')" title="Click to edit">
                ${statusIcon}
                <div class="cell-content">${content}</div>
            </div>
        `;
    }

    /**
     * Generate single cell
     */
    async generateCell(cellKey) {
        if (!this.hasRequiredKeys()) {
            this.showMessage('Please configure your API keys first', 'error');
            return;
        }

        const [productName, cnaeCode] = cellKey.split('-');
        const product = this.products.find(p => p.name === productName);
        const cnae = this.cnaes.find(c => c.code === cnaeCode);

        if (!product || !cnae) {
            AuthManager.showError('Invalid cell reference');
            return;
        }

        this.matrixData[cellKey] = { status: 'generating' };
        this.renderMatrix();
        this.saveData();

        try {
            // Generate final prompt using LLM with structured input
            const finalPrompt = await this.generateFinalPrompt(product.name, product.prompt, cnae);
            
            console.log(`Generated prompt for ${product.name} - ${cnae.name}:`, finalPrompt);

            // Generate image using the LLM-generated prompt
            const imageOutput = await AuthManager.generateImage(finalPrompt);
            const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;

            this.matrixData[cellKey] = {
                status: 'generated',
                imageUrl: imageUrl,
                prompt: finalPrompt,
                product: product.name,
                cnae: cnae.name,
                generatedAt: new Date().toISOString()
            };

            this.renderMatrix();
            this.saveData();
            this.updateCarouselIfNeeded(cnae.name);

            AuthManager.showSuccess(`Generated: ${product.name} for ${cnae.name}`);

        } catch (error) {
            console.error('Generation failed:', error);
            this.matrixData[cellKey] = { 
                status: 'error', 
                error: error.message,
                lastAttempt: new Date().toISOString()
            };
            this.renderMatrix();
            this.saveData();
            AuthManager.showError(`Generation failed: ${error.message}`);
        }
    }

    /**
     * Generate full row (all CNAEs for one product)
     */
    async generateRow(productName) {
        const product = this.products.find(p => p.name === productName);
        if (!product) return;

        const cells = this.cnaes.map(cnae => `${productName}-${cnae.name}`);
        await this.generateMultipleCells(cells, `Generating row: ${productName}`);
    }

    /**
     * Generate full column (all products for one CNAE)
     */
    async generateColumn(cnaeName) {
        const cnae = this.cnaes.find(c => c.name === cnaeName);
        if (!cnae) return;

        const cells = this.products.map(product => `${product.name}-${cnaeName}`);
        await this.generateMultipleCells(cells, `Generating column: ${cnae.name}`);
    }

    /**
     * Generate full matrix
     */
    async generateFullMatrix() {
        const cells = [];
        this.products.forEach(product => {
            this.cnaes.forEach(cnae => {
                cells.push(`${product.name}-${cnae.name}`);
            });
        });
        
        await this.generateMultipleCells(cells, 'Generating full matrix');
    }

    /**
     * Generate random sample (3x3)
     */
    async generateRandomSample() {
        const sampleCnaes = this.cnaes.slice(0, 3);
        const sampleProducts = this.products.slice(0, 3);
        
        const cells = [];
        sampleProducts.forEach(product => {
            sampleCnaes.forEach(cnae => {
                cells.push(`${product.name}-${cnae.name}`);
            });
        });

        await this.generateMultipleCells(cells, 'Generating sample (3x3)');
    }

    /**
     * Generate multiple cells with progress tracking
     */
    async generateMultipleCells(cells, progressLabel) {
        if (!AuthManager.hasRequiredKeys()) {
            AuthManager.showError('Please configure your API keys first');
            return;
        }

        if (this.isGenerating) {
            AuthManager.showError('Generation already in progress');
            return;
        }

        this.isGenerating = true;
        const progressSection = document.querySelector('.progress-section');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        progressSection.style.display = 'block';
        progressText.textContent = `${progressLabel}: 0/${cells.length} completed`;

        let completed = 0;
        const total = cells.length;

        // Process cells in batches to avoid rate limits
        const batchSize = 3;
        for (let i = 0; i < cells.length; i += batchSize) {
            const batch = cells.slice(i, i + batchSize);
            
            await Promise.allSettled(batch.map(async (cellKey) => {
                try {
                    await this.generateCell(cellKey);
                    completed++;
                } catch (error) {
                    console.error(`Failed to generate ${cellKey}:`, error);
                    completed++;
                }
                
                // Update progress
                const percentage = (completed / total) * 100;
                progressFill.style.width = `${percentage}%`;
                progressText.textContent = `${progressLabel}: ${completed}/${total} completed`;
            }));

            // Wait between batches to respect rate limits
            if (i + batchSize < cells.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Hide progress and cleanup
        setTimeout(() => {
            progressSection.style.display = 'none';
            this.isGenerating = false;
        }, 2000);

        AuthManager.showSuccess(`${progressLabel} completed! Generated ${completed}/${total} items.`);
    }

    /**
     * View generated image in modal
     */
    viewImage(cellKey) {
        const cellData = this.matrixData[cellKey];
        if (!cellData || !cellData.imageUrl) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;

        const img = document.createElement('img');
        img.src = cellData.imageUrl;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        modal.appendChild(img);
        document.body.appendChild(modal);

        // Close on click
        modal.addEventListener('click', () => modal.remove());
        
        // Close on escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    /**
     * Delete generated content
     */
    deleteGeneration(cellKey) {
        if (confirm('Are you sure you want to delete this generated content?')) {
            delete this.matrixData[cellKey];
            this.renderMatrix();
            this.saveData();
            
            // Update carousel if needed
            const cnaeName = cellKey.split('-')[1];
            this.updateCarouselIfNeeded(cnaeName);
            
            AuthManager.showSuccess('Content deleted');
        }
    }

    /**
     * Update demo selector dropdown
     */
    updateDemoSelector() {
        const select = document.getElementById('demo-cnae-select');
        select.innerHTML = '<option value="">Select a CNAE to preview</option>';
        
        this.cnaes.forEach(cnae => {
            const option = document.createElement('option');
            option.value = cnae.name;
            option.textContent = cnae.name;
            select.appendChild(option);
        });
    }

    /**
     * Load demo carousel for selected CNAE
     */
    loadDemoCarousel(cnaeName) {
        if (!cnaeName) {
            this.carouselData = [];
            this.updateCarouselDisplay();
            return;
        }

        const cnae = this.cnaes.find(c => c.name === cnaeName);
        if (!cnae) return;

        // Get all generated content for this CNAE
        this.carouselData = this.products
            .map(product => {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                
                if (cellData && cellData.status === 'generated' && cellData.imageUrl) {
                    return {
                        title: product.name,
                        imageUrl: cellData.imageUrl,
                        prompt: cellData.prompt
                    };
                }
                return null;
            })
            .filter(item => item !== null);

        this.currentSlide = 0;
        this.updateCarouselDisplay();

        // Update header
        document.getElementById('demo-cnae-title').textContent = cnae.name;
    }

    /**
     * Update carousel display
     */
    updateCarouselDisplay() {
        const container = document.getElementById('carousel-container');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        const indicator = document.getElementById('slide-indicator');

        if (this.carouselData.length === 0) {
            container.innerHTML = '<div class="carousel-placeholder"><p>🎬 Generated content will appear here</p></div>';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            indicator.textContent = '0/0';
            return;
        }

        // Create slides
        container.innerHTML = '';
        this.carouselData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === this.currentSlide ? 'active' : ''}`;
            slide.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <h4>${item.title}</h4>
            `;
            container.appendChild(slide);
        });

        // Update controls
        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide >= this.carouselData.length - 1;
        indicator.textContent = `${this.currentSlide + 1}/${this.carouselData.length}`;
    }

    /**
     * Go to previous slide
     */
    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarouselDisplay();
        }
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        if (this.currentSlide < this.carouselData.length - 1) {
            this.currentSlide++;
            this.updateCarouselDisplay();
        }
    }

    /**
     * Update carousel if the selected CNAE matches
     */
    updateCarouselIfNeeded(cnaeName) {
        const selectedCnae = document.getElementById('demo-cnae-select').value;
        if (selectedCnae === cnaeName) {
            this.loadDemoCarousel(cnaeName);
        }
    }

    /**
     * Reset all data
     */
    resetAllData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.cnaes = [...this.defaultCnaes];
            this.products = [...this.defaultProducts];
            this.matrixData = {};
            this.carouselData = [];
            this.currentSlide = 0;

            this.renderCnaeList();
            this.renderProductList();
            this.renderMatrix();
            this.updateDemoSelector();
            this.updateCarouselDisplay();
            this.saveData();

            AuthManager.showSuccess('All data has been reset to defaults');
        }
    }

    /**
     * Generate random Brazilian character characteristics
     */
    generateRandomCharacteristics() {
        const ethnicity = this.brazilianCharacteristics.ethnicities[Math.floor(Math.random() * this.brazilianCharacteristics.ethnicities.length)];
        const city = this.brazilianCharacteristics.cities[Math.floor(Math.random() * this.brazilianCharacteristics.cities.length)];
        const timeOfDay = this.brazilianCharacteristics.timesOfDay[Math.floor(Math.random() * this.brazilianCharacteristics.timesOfDay.length)];
        const environment = this.brazilianCharacteristics.environments[Math.floor(Math.random() * this.brazilianCharacteristics.environments.length)];
        
        return {
            ethnicity,
            city,
            timeOfDay,
            environment
        };
    }

    /**
     * Update product prompt from inline editor
     */
    updateProductPrompt(productName) {
        const textarea = document.getElementById(`prompt-${productName.replace(/\s+/g, '-')}`);
        if (!textarea) return;

        const newPrompt = SecurityUtils.sanitizeInput(textarea.value);
        if (!newPrompt) {
            AuthManager.showError('Prompt cannot be empty');
            return;
        }

        const product = this.products.find(p => p.name === productName);
        if (product) {
            product.prompt = newPrompt;
            this.saveData();
            AuthManager.showSuccess(`Updated prompt for ${productName}`);
        }
    }

    /**
     * Export configuration to JSON file
     */
    exportConfiguration() {
        const config = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            cnaes: this.cnaes,
            products: this.products,
            matrixData: this.matrixData,
            maxMatrixSize: this.maxMatrixSize
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `omni-jimmer-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        AuthManager.showSuccess('Configuration exported successfully');
    }

    /**
     * Import configuration from JSON file
     */
    importConfiguration(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                if (!config.version || !config.cnaes || !config.products) {
                    throw new Error('Invalid configuration file format');
                }

                // Validate limits
                if (config.cnaes.length > this.maxMatrixSize || config.products.length > this.maxMatrixSize) {
                    throw new Error(`Configuration exceeds maximum matrix size of ${this.maxMatrixSize}x${this.maxMatrixSize}`);
                }

                this.cnaes = config.cnaes;
                this.products = config.products;
                this.matrixData = config.matrixData || {};
                
                if (config.maxMatrixSize) {
                    this.maxMatrixSize = config.maxMatrixSize;
                }

                this.renderCnaeList();
                this.renderProductList();
                this.renderMatrix();
                this.updateDemoSelector();
                this.saveData();

                AuthManager.showSuccess(`Configuration imported successfully (${config.cnaes.length} CNAEs, ${config.products.length} products)`);
                
            } catch (error) {
                console.error('Import error:', error);
                AuthManager.showError(`Import failed: ${error.message}`);
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    /**
     * Download all generated images as a ZIP file
     */
    async downloadAllImages() {
        const generatedImages = Object.values(this.matrixData).filter(
            data => data.status === 'generated' && data.imageUrl
        );

        if (generatedImages.length === 0) {
            AuthManager.showError('No generated images to download');
            return;
        }

        try {
            // Import JSZip dynamically
            if (typeof JSZip === 'undefined') {
                // Load JSZip from CDN if not already loaded
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                document.head.appendChild(script);
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });
            }

            const zip = new JSZip();
            const imageFolder = zip.folder('omni-jimmer-images');

            // Download each image and add to zip
            for (const [index, data] of generatedImages.entries()) {
                try {
                    AuthManager.showSuccess(`Downloading image ${index + 1}/${generatedImages.length}...`);
                    
                    const response = await fetch(data.imageUrl);
                    const blob = await response.blob();
                    
                    const filename = `${data.product}_${data.cnae}_${data.generatedAt.split('T')[0]}.jpg`;
                    imageFolder.file(filename, blob);
                    
                } catch (error) {
                    console.warn(`Failed to download image for ${data.product}-${data.cnae}:`, error);
                }
            }

            // Add metadata file
            const metadata = {
                exportDate: new Date().toISOString(),
                totalImages: generatedImages.length,
                images: generatedImages.map(data => ({
                    product: data.product,
                    cnae: data.cnae,
                    prompt: data.prompt,
                    generatedAt: data.generatedAt
                }))
            };
            zip.file('metadata.json', JSON.stringify(metadata, null, 2));

            // Generate and download ZIP
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `omni-jimmer-images-${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            AuthManager.showSuccess(`Downloaded ${generatedImages.length} images successfully`);
            
        } catch (error) {
            console.error('Download failed:', error);
            AuthManager.showError(`Download failed: ${error.message}`);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing Omni Jimmer App...');
    try {
        window.app = new OmniJimmerApp();
        console.log('✅ Omni Jimmer App initialized successfully');
        
        // Test button functionality
        const testBtn = document.getElementById('generate-full-matrix');
        const addCnaeBtn = document.getElementById('add-cnae');
        const addProductBtn = document.getElementById('add-product');
        
        console.log('🔍 Button check:');
        console.log('  - Generate button:', !!testBtn);
        console.log('  - Add CNAE button:', !!addCnaeBtn);
        console.log('  - Add Product button:', !!addProductBtn);
        
    } catch (error) {
        console.error('❌ Failed to initialize Omni Jimmer App:', error);
        alert('Failed to initialize the application. Check the console for details.');
    }
});

// Add reset functionality to window for debugging
window.resetApp = () => app.resetAllData();
