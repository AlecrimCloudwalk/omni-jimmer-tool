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

        // Initialize new modular prompt builder
        this.promptBuilder = new PromptBuilder();

        // Legacy Brazilian characteristics for backward compatibility (can be removed later)
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
        
        // Initialize AuthManager reference
        this.authManager = null;
        this.initAuthManager();
    }

    /**
     * Initialize with default CNAEs and products
     */
    initializeDefaults() {
        // Default CNAEs with MCC codes for global business classifications
        this.defaultCnaes = [
            { name: 'Restaurante', mcc: '5611' },
            { name: 'Loja de Roupa', mcc: '5651' },
            { name: 'Loja de Móvel', mcc: '5712' },
            { name: 'Oficina Automotiva', mcc: '7538' },
            { name: 'Clínicas / Odonto / Estética', mcc: '8011' },
            { name: 'Salão de Beleza', mcc: '7211' },
            { name: 'Tatuagem', mcc: '7211' },
            { name: 'Mercadinho', mcc: '5411' },
            { name: 'Driver / Uber', mcc: '4121' },
            { name: 'Loja de Eletrônico', mcc: '5732' },
            { name: 'Material Construção', mcc: '5211' },
            { name: 'Guia Turismo', mcc: '4511' }
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

        // Global style prompt controls
        const saveStyleBtn = document.getElementById('save-style-prompt');
        const resetStyleBtn = document.getElementById('reset-style-prompt');
        const styleTextarea = document.getElementById('global-style-prompt');
        
        if (saveStyleBtn && styleTextarea) {
            saveStyleBtn.addEventListener('click', () => this.saveGlobalStylePrompt());
            console.log('✅ Save style prompt button listener added');
        }
        
        if (resetStyleBtn && styleTextarea) {
            resetStyleBtn.addEventListener('click', () => this.resetGlobalStylePrompt());
            console.log('✅ Reset style prompt button listener added');
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

        // Click-and-hold functionality for row controls
        this.setupClickAndHoldControls();
        
        // Setup collapsible sidebar functionality
        this.setupSidebar();
    }

    /**
     * Initialize AuthManager reference
     */
    initAuthManager() {
        // Wait for AuthManager to be available
        const waitForAuthManager = () => {
            if (window.AuthManager) {
                this.authManager = window.AuthManager;
                console.log('✅ AuthManager initialized successfully');
            } else {
                console.log('⏳ Waiting for AuthManager...');
                setTimeout(waitForAuthManager, 100);
            }
        };
        waitForAuthManager();
    }

    /**
     * Load stored data from localStorage
     */
    loadStoredData() {
        const storedCnaes = localStorage.getItem('omni_jimmer_cnaes');
        const storedProducts = localStorage.getItem('omni_jimmer_products');
        const storedMatrix = localStorage.getItem('omni_jimmer_matrix');
        const storedSeeds = localStorage.getItem('omni_jimmer_seeds');
        const storedGlobalStyle = localStorage.getItem('omni_jimmer_global_style');

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

        // Load global style prompt
        if (storedGlobalStyle) {
            this.promptBuilder.updateGlobalStylePrompt(storedGlobalStyle);
        }
        
        // Initialize the UI with the loaded global style prompt
        this.loadGlobalStylePromptToUI();

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
        localStorage.setItem('omni_jimmer_global_style', this.promptBuilder.getGlobalStylePrompt());
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
            // Just log to console instead of annoying alert popups
            console.log(`${type.toUpperCase()}: ${message}`);
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
        this.matrixData[cellKey].loadingGif = true; // Add loading state
        this.renderMatrix();
        this.saveData();

        try {
            const imageOutput = await window.AuthManager.generateImage(cellData.prompt);
            const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;

            this.matrixData[cellKey] = {
                ...cellData,
                status: 'generated',
                imageUrl: imageUrl,
                generatedAt: new Date().toISOString(),
                loadingGif: false // Clear loading state
            };

            this.renderMatrix();
            this.saveData();
            this.updateCarouselIfNeeded(cellData.cnae);
            
        } catch (error) {
            console.error('Image generation failed:', error);
            this.matrixData[cellKey] = { 
                ...cellData,
                status: 'error',
                error: error.message,
                loadingGif: false // Clear loading state
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
        
        // Show dynamic characteristics (read-only) using new format
        const seedInfo = this.getSeededCharacteristics(this.getProductSeed(productName));
        characteristicsDiv.textContent = `${seedInfo.ethnicity}, ${seedInfo.clothingColor} clothing, ${seedInfo.timeOfDay}`;
        
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
        btn.innerHTML = '🤖 Generating... <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 20px; height: 20px; vertical-align: middle;">';
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
        const imagePreview = document.getElementById('image-preview');
        
        btn.disabled = true;
        btn.innerHTML = '🎨 Generating... <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 20px; height: 20px; vertical-align: middle;">';
        this.setWorkflowStepGenerating(2);
        
        // Show loading animation in image preview
        imagePreview.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; flex-direction: column;">
                <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 80px; height: 80px;">
                <p style="margin-top: 10px; color: #a8a8ad; font-size: 14px;">Generating image...</p>
            </div>
        `;
        
        try {
            await this.generateImageFromPrompt(this.currentCellKey);
            const cellData = this.matrixData[this.currentCellKey];
            if (cellData && cellData.imageUrl) {
                imagePreview.innerHTML = `<img src="${cellData.imageUrl}" alt="Generated image">`;
                this.setWorkflowStepCompleted(2);
                document.getElementById('regenerate-image-btn').style.display = 'inline-block';
            }
        } catch (error) {
            this.setWorkflowStepError(2);
            this.showMessage('Failed to generate image', 'error');
            imagePreview.innerHTML = '<div class="placeholder">Image generation failed</div>';
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
        // Delete without confirmation
        delete this.matrixData[this.currentCellKey];
        this.renderMatrix();
        this.saveData();
        this.closeCellModal();
        this.showMessage('Cell data deleted', 'success');
    }

    /**
     * Mark step button as processing
     */
    markStepButtonProcessing(productName, cnaeName, step, isRow = true) {
        if (isRow) {
            // Row button - use product name
            const button = document.querySelector(`.product-header[data-product="${productName}"] .shuffle-btn.step-${step}`);
            if (button) {
                button.classList.add('processing');
            }
        } else {
            // Column button - find by cnae name in h3
            const cnaeHeaders = document.querySelectorAll('.cnae-header-card');
            for (const header of cnaeHeaders) {
                const h3 = header.querySelector('h3');
                if (h3 && h3.textContent.trim() === cnaeName) {
                    const button = header.querySelector(`.shuffle-btn.step-${step}`);
                    if (button) {
                        button.classList.add('processing');
                    }
                    break;
                }
            }
        }
    }

    /**
     * Mark step button as completed
     */
    markStepButtonCompleted(productName, cnaeName, step, isRow = true) {
        if (isRow) {
            // Row button - use product name
            const button = document.querySelector(`.product-header[data-product="${productName}"] .shuffle-btn.step-${step}`);
            if (button) {
                button.classList.remove('processing');
                button.classList.add('completed');
            }
        } else {
            // Column button - find by cnae name in h3
            const cnaeHeaders = document.querySelectorAll('.cnae-header-card');
            for (const header of cnaeHeaders) {
                const h3 = header.querySelector('h3');
                if (h3 && h3.textContent.trim() === cnaeName) {
                    const button = header.querySelector(`.shuffle-btn.step-${step}`);
                    if (button) {
                        button.classList.remove('processing');
                        button.classList.add('completed');
                    }
                    break;
                }
            }
        }
    }

    /**
     * Generate column step (1=prompts, 2=images, 3=videos)
     */
    async generateColumnStep(cnaeName, step) {
        const cnaeProducts = this.products.filter(p => p.name); // Get all products
        
        // Mark button as processing
        this.markStepButtonProcessing(null, cnaeName, step, false);
        
        if (step === 1) {
            // Generate all prompts for column IN PARALLEL
            const promises = cnaeProducts.map(async (product) => {
                const cellKey = `${product.name}-${cnaeName}`;
                try {
                    await this.generatePromptForCell(cellKey);
                    return { success: true, cellKey };
                } catch (error) {
                    console.error(`Failed to generate prompt for ${cellKey}:`, error);
                    return { success: false, cellKey, error };
                }
            });
            
            const results = await Promise.all(promises);
            const completed = results.filter(r => r.success).length;
            this.showMessage(`Generated ${completed}/${cnaeProducts.length} prompts for ${cnaeName} (parallel)`, 'success');
            
            // Mark column step 1 as completed
            this.markStepButtonCompleted(null, cnaeName, 1, false);
            
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
            
            // Mark column step 2 as completed
            this.markStepButtonCompleted(null, cnaeName, 2, false);
            
        } else if (step === 3) {
            // Video generation - coming soon
            this.showMessage('Video generation coming soon!', 'info');
            
            // Mark column step 3 as completed (even though it's placeholder)
            this.markStepButtonCompleted(null, cnaeName, 3, false);
        }
        
        this.renderMatrix();
    }

    /**
     * Generate row step (1=prompts, 2=images, 3=videos)
     */
    async generateRowStep(productName, step) {
        const product = this.products.find(p => p.name === productName);
        if (!product) return;
        
        // Mark button as processing
        this.markStepButtonProcessing(productName, null, step, true);
        
        if (step === 1) {
            // Generate all prompts for row IN PARALLEL
            const promises = this.cnaes.map(async (cnae) => {
                const cellKey = `${productName}-${cnae.name}`;
                try {
                    await this.generatePromptForCell(cellKey);
                    return { success: true, cellKey };
                } catch (error) {
                    console.error(`Failed to generate prompt for ${cellKey}:`, error);
                    return { success: false, cellKey, error };
                }
            });
            
            const results = await Promise.all(promises);
            const completed = results.filter(r => r.success).length;
            this.showMessage(`Generated ${completed}/${this.cnaes.length} prompts for ${productName} (parallel)`, 'success');
            
            // Mark row step 1 as completed
            this.markStepButtonCompleted(productName, null, 1, true);
            
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
            
            // Mark row step 2 as completed
            this.markStepButtonCompleted(productName, null, 2, true);
            
        } else if (step === 3) {
            // Video generation - coming soon
            this.showMessage('Video generation coming soon!', 'info');
            
            // Mark row step 3 as completed (even though it's placeholder)
            this.markStepButtonCompleted(productName, null, 3, true);
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
     * Get characteristics based on seed using new PromptBuilder
     */
    getSeededCharacteristics(seed) {
        // Use new PromptBuilder for consistent characteristics
        return this.promptBuilder.getSeededCharacteristics(seed);
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
     * Generate final prompt using simplified approach - let LLM do the work!
     */
    async generateFinalPrompt(productName, basePrompt, cnae) {
        console.log('🎯 generateFinalPrompt called with:', { productName, basePrompt, cnae: cnae.name });
        
        // Get MCC code and seed
        const mccCode = cnae.mcc || '5999';
        const seed = this.getProductSeed(productName);
        
        // Build simple input for LLM using PromptBuilder
        const llmInput = this.promptBuilder.buildLLMInput(basePrompt, mccCode, seed);
        console.log('📝 LLM input created:', llmInput);
        
        // Check if we have the required API keys
        if (!this.hasRequiredKeys()) {
            console.warn('❌ API keys not configured, falling back to simple concatenation');
            return `${basePrompt}. ${llmInput.ethnicity}, wearing ${llmInput.clothingColor} clothing, during ${llmInput.timeOfDay}, working in ${cnae.name}`;
        }
        
        try {
            console.log('🤖 Attempting LLM prompt generation...');
            
            // Check if AuthManager and method are available
            if (!window.AuthManager) {
                throw new Error('AuthManager not available on window object');
            }
            
            if (typeof window.AuthManager.generatePromptWithInstructions !== 'function') {
                throw new Error(`generatePromptWithInstructions method not found on AuthManager`);
            }
            
            // Get LLM instructions from PromptBuilder
            const promptInstructions = this.promptBuilder.getLLMInstructions();
            
            // Create simple formatted input for LLM
            const formattedInput = `MCC Code: ${llmInput.mccCode}
Product Prompt: "${llmInput.productPrompt}"
Time of Day: ${llmInput.timeOfDay}
Ethnicity: ${llmInput.ethnicity}
Clothing Color: ${llmInput.clothingColor}
Global Style: "${llmInput.globalStylePrompt}"`;

            console.log('🔍 Sending to LLM:', formattedInput);

            const finalPrompt = await window.AuthManager.generatePromptWithInstructions(promptInstructions, formattedInput);
            console.log('✅ LLM prompt generation successful:', finalPrompt);
            return finalPrompt;
        } catch (error) {
            console.error('❌ LLM prompt generation failed, falling back to simple concatenation:', error);
            // Show error to user
            this.showMessage(`LLM prompt generation failed: ${error.message}. Using fallback.`, 'warning');
            
            // Fallback to simple approach if LLM fails
            const fallbackPrompt = `${basePrompt}. ${llmInput.ethnicity}, wearing ${llmInput.clothingColor} clothing, during ${llmInput.timeOfDay}, working in ${cnae.name}`;
            console.log('🔄 Using fallback prompt:', fallbackPrompt);
            return fallbackPrompt;
        }
    }

    /**
     * Load global style prompt to UI
     */
    loadGlobalStylePromptToUI() {
        const styleTextarea = document.getElementById('global-style-prompt');
        if (styleTextarea) {
            styleTextarea.value = this.promptBuilder.getGlobalStylePrompt();
        }
    }

    /**
     * Save global style prompt from UI
     */
    saveGlobalStylePrompt() {
        const styleTextarea = document.getElementById('global-style-prompt');
        if (styleTextarea) {
            const newStylePrompt = styleTextarea.value.trim();
            if (newStylePrompt) {
                this.promptBuilder.updateGlobalStylePrompt(newStylePrompt);
                this.saveData();
                this.showMessage('Global style prompt saved successfully', 'success');
            } else {
                this.showMessage('Style prompt cannot be empty', 'error');
            }
        }
    }

    /**
     * Reset global style prompt to default
     */
    resetGlobalStylePrompt() {
        // Create new PromptBuilder instance to get default style prompt
        const defaultBuilder = new PromptBuilder();
        const defaultStylePrompt = defaultBuilder.getGlobalStylePrompt();
        
        this.promptBuilder.updateGlobalStylePrompt(defaultStylePrompt);
        this.loadGlobalStylePromptToUI();
        this.saveData();
        this.showMessage('Global style prompt reset to default', 'success');
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
     * Make product name editable on click
     */
    makeProductNameEditable(productName, element) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = productName;
        input.className = 'product-name-edit-input';
        input.style.cssText = `
            background: transparent;
            border: 1px solid var(--green);
            color: var(--text);
            font-size: 0.9rem;
            font-weight: 600;
            text-align: center;
            width: 100%;
            padding: 4px 8px;
            border-radius: 4px;
        `;
        
        const saveEdit = () => {
            const newName = input.value.trim();
            if (newName && newName !== productName) {
                const productIndex = this.products.findIndex(p => p.name === productName);
                if (productIndex >= 0) {
                    this.updateProduct(productIndex, 'name', newName);
                    this.renderMatrix();
                }
            } else {
                element.textContent = productName;
                element.style.display = 'block';
                input.remove();
            }
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
            }
        });
        
        element.style.display = 'none';
        element.parentNode.insertBefore(input, element);
        input.focus();
        input.select();
    }

    /**
     * Make prompt editable on click
     */
    makePromptEditable(productIndex, displayElement) {
        const container = displayElement.parentNode;
        const textarea = container.querySelector('.prompt-edit');
        
        displayElement.classList.add('hidden');
        textarea.classList.remove('hidden');
        textarea.focus();
        textarea.select();
    }

    /**
     * Save prompt edit
     */
    savePromptEdit(productIndex, textarea) {
        const container = textarea.parentNode;
        const displayElement = container.querySelector('.prompt-display');
        const newValue = textarea.value.trim();
        
        if (newValue) {
            this.updateProduct(productIndex, 'prompt', newValue);
            displayElement.textContent = newValue;
        }
        
        textarea.classList.add('hidden');
        displayElement.classList.remove('hidden');
    }

    /**
     * Setup collapsible sidebar functionality
     */
    setupSidebar() {
        const menuToggle = document.getElementById('menu-toggle');
        const closeSidebar = document.getElementById('close-sidebar');
        const sidebar = document.getElementById('controls-sidebar');
        const threeColumnContainer = document.querySelector('.three-column-container');
        
        // Menu toggle functionality
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        
        // Close button functionality
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });
        
        // Handle ESC key to close sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
                this.closeSidebar();
            }
        });
    }
    
    /**
     * Toggle sidebar open/close
     */
    toggleSidebar() {
        const sidebar = document.getElementById('controls-sidebar');
        const menuToggle = document.getElementById('menu-toggle');
        const threeColumnContainer = document.querySelector('.three-column-container');
        
        if (sidebar && menuToggle && threeColumnContainer) {
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        }
    }
    
    /**
     * Open sidebar
     */
    openSidebar() {
        const sidebar = document.getElementById('controls-sidebar');
        const menuToggle = document.getElementById('menu-toggle');
        const threeColumnContainer = document.querySelector('.three-column-container');
        
        if (sidebar && menuToggle && threeColumnContainer) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('open');
            menuToggle.classList.add('active');
            threeColumnContainer.classList.add('sidebar-open');
        }
    }
    
    /**
     * Close sidebar
     */
    closeSidebar() {
        const sidebar = document.getElementById('controls-sidebar');
        const menuToggle = document.getElementById('menu-toggle');
        const threeColumnContainer = document.querySelector('.three-column-container');
        
        if (sidebar && menuToggle && threeColumnContainer) {
            sidebar.classList.remove('open');
            sidebar.classList.add('collapsed');
            menuToggle.classList.remove('active');
            threeColumnContainer.classList.remove('sidebar-open');
        }
    }

    /**
     * Setup click-and-hold functionality for row controls
     */
    setupClickAndHoldControls() {
        let holdTimer = null;
        let isHolding = false;

        // Use event delegation to handle dynamically created elements
        document.addEventListener('mousedown', (e) => {
            // Handle product headers
            const productHeader = e.target.closest('.product-header');
            if (productHeader) {
                const productName = productHeader.dataset.product;
                const controls = productHeader.querySelector(`[data-controls="${productName}"]`);
                
                if (controls) {
                    isHolding = false;
                    holdTimer = setTimeout(() => {
                        isHolding = true;
                        controls.classList.remove('hidden');
                        productHeader.classList.add('showing-controls');
                    }, 500); // 500ms hold time
                }
                return;
            }

            // Handle CNAE headers
            const cnaeHeader = e.target.closest('.cnae-header-card');
            if (cnaeHeader) {
                isHolding = false;
                holdTimer = setTimeout(() => {
                    isHolding = true;
                    cnaeHeader.classList.add('showing-remove');
                }, 500); // 500ms hold time
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }

            // Hide controls if not holding
            if (!isHolding) {
                // Hide product controls
                const productHeaders = document.querySelectorAll('.product-header');
                productHeaders.forEach(header => {
                    const controls = header.querySelector('[data-controls]');
                    if (controls) {
                        controls.classList.add('hidden');
                        header.classList.remove('showing-controls');
                    }
                });

                // Hide CNAE remove buttons
                const cnaeHeaders = document.querySelectorAll('.cnae-header-card');
                cnaeHeaders.forEach(header => {
                    header.classList.remove('showing-remove');
                });
            }
        });

        // Touch events for mobile
        document.addEventListener('touchstart', (e) => {
            // Handle product headers
            const productHeader = e.target.closest('.product-header');
            if (productHeader) {
                const productName = productHeader.dataset.product;
                const controls = productHeader.querySelector(`[data-controls="${productName}"]`);
                
                if (controls) {
                    isHolding = false;
                    holdTimer = setTimeout(() => {
                        isHolding = true;
                        controls.classList.remove('hidden');
                        productHeader.classList.add('showing-controls');
                    }, 500);
                }
                return;
            }

            // Handle CNAE headers
            const cnaeHeader = e.target.closest('.cnae-header-card');
            if (cnaeHeader) {
                isHolding = false;
                holdTimer = setTimeout(() => {
                    isHolding = true;
                    cnaeHeader.classList.add('showing-remove');
                }, 500);
            }
        });

        document.addEventListener('touchend', (e) => {
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }

            if (!isHolding) {
                // Hide product controls
                const productHeaders = document.querySelectorAll('.product-header');
                productHeaders.forEach(header => {
                    const controls = header.querySelector('[data-controls]');
                    if (controls) {
                        controls.classList.add('hidden');
                        header.classList.remove('showing-controls');
                    }
                });

                // Hide CNAE remove buttons
                const cnaeHeaders = document.querySelectorAll('.cnae-header-card');
                cnaeHeaders.forEach(header => {
                    header.classList.remove('showing-remove');
                });
            }
        });
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
        
        // Auto-generate without confirmation dialog
        await this.generateRow(productName);
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
        
        // Auto-generate without confirmation dialog
        await this.generateColumn(cnaeName);
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
                    <button class="shuffle-btn step-1" onclick="app.generateColumnStep('${cnae.name}', 1)" title="Generate all prompts">1</button>
                    <button class="shuffle-btn step-2" onclick="app.generateColumnStep('${cnae.name}', 2)" title="Generate all images">2</button>
                    <button class="shuffle-btn step-3" onclick="app.generateColumnStep('${cnae.name}', 3)" title="Generate all videos">3</button>
                </div>
                <h3>${cnae.name}</h3>
                <button class="shuffle-btn" onclick="app.removeCnae('${cnae.name}')" title="Remove CNAE">×</button>
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
                <div class="product-header" data-product="${product.name}">
                    <div class="product-step-buttons-strip">
                        <button class="shuffle-btn step-1" onclick="app.generateRowStep('${product.name}', 1)" title="Generate all prompts for row">1</button>
                        <button class="shuffle-btn step-2" onclick="app.generateRowStep('${product.name}', 2)" title="Generate all images for row">2</button>
                        <button class="shuffle-btn step-3" onclick="app.generateRowStep('${product.name}', 3)" title="Generate all videos for row">3</button>
                    </div>
                    <div class="product-title-container">
                        <div class="product-name-display" onclick="app.makeProductNameEditable('${product.name}', this)">${product.name}</div>
                    </div>
                    <div class="product-controls hidden" data-controls="${product.name}">
                        <button class="shuffle-btn" onclick="app.shuffleProductCharacteristics('${product.name}')" title="Shuffle">🔄</button>
                        <button class="shuffle-btn" onclick="app.removeProduct('${product.name}')" title="Remove">×</button>
                    </div>
                </div>
            `;
            productRow.appendChild(productColumn);

            // Prompt & Characteristics column
            const promptColumn = document.createElement('div');
            promptColumn.className = 'prompt-column';
            const seedInfo = this.getSeededCharacteristics(this.getProductSeed(product.name));
            promptColumn.innerHTML = `
                <div class="prompt-display-container" data-product-index="${productIndex}">
                    <div class="prompt-display" onclick="app.makePromptEditable(${productIndex}, this)">${product.prompt || 'Professional top-view product shot on clean white background'}</div>
                    <textarea class="prompt-edit hidden" 
                              onblur="app.savePromptEdit(${productIndex}, this)"
                              onkeypress="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); this.blur(); }">${product.prompt || 'Professional top-view product shot on clean white background'}</textarea>
                </div>
                <div class="characteristics-display">${seedInfo.ethnicity}, ${seedInfo.clothingColor} clothing, ${seedInfo.timeOfDay}</div>
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
                if (cellData.loadingGif) {
                    content = `
                        <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; padding: 10px;">
                            <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 40px; height: 40px;">
                            <p style="margin-top: 8px; color: #a8a8ad; font-size: 12px; text-align: center;">Generating...</p>
                        </div>
                    `;
                } else {
                    content = 'Generating...';
                }
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
            this.showMessage('Invalid cell reference', 'error');
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
            const imageOutput = await window.AuthManager.generateImage(finalPrompt);
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

            this.showMessage(`Generated: ${product.name} for ${cnae.name}`, 'success');

        } catch (error) {
            console.error('Generation failed:', error);
            this.matrixData[cellKey] = { 
                status: 'error', 
                error: error.message,
                lastAttempt: new Date().toISOString()
            };
            this.renderMatrix();
            this.saveData();
            this.showMessage(`Generation failed: ${error.message}`, 'error');
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
        if (!this.hasRequiredKeys()) {
            this.showMessage('Please configure your API keys first', 'error');
            return;
        }

        if (this.isGenerating) {
            this.showMessage('Generation already in progress', 'error');
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

        this.showMessage(`${progressLabel} completed! Generated ${completed}/${total} items.`, 'success');
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
        // Delete without confirmation
        delete this.matrixData[cellKey];
        this.renderMatrix();
        this.saveData();
        
        // Update carousel if needed
        const cnaeName = cellKey.split('-')[1];
        this.updateCarouselIfNeeded(cnaeName);
        
        this.showMessage('Content deleted', 'success');
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
        // Reset without confirmation - just do it
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

        this.showMessage('All data has been reset to defaults', 'success');
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
            this.showMessage('Prompt cannot be empty', 'error');
            return;
        }

        const product = this.products.find(p => p.name === productName);
        if (product) {
            product.prompt = newPrompt;
            this.saveData();
            this.showMessage(`Updated prompt for ${productName}`, 'success');
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

        this.showMessage('Configuration exported successfully', 'success');
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

                this.showMessage(`Configuration imported successfully (${config.cnaes.length} CNAEs, ${config.products.length} products)`, 'success');
                
            } catch (error) {
                console.error('Import error:', error);
                this.showMessage(`Import failed: ${error.message}`, 'error');
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
            this.showMessage('No generated images to download', 'error');
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
                    this.showMessage(`Downloading image ${index + 1}/${generatedImages.length}...`, 'info');
                    
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

            this.showMessage(`Downloaded ${generatedImages.length} images successfully`, 'success');
            
        } catch (error) {
            console.error('Download failed:', error);
            this.showMessage(`Download failed: ${error.message}`, 'error');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing Omni Jimmer App...');
    
    // Debug AuthManager availability
    console.log('🔍 AuthManager debug:', {
        exists: !!window.AuthManager,
        type: typeof window.AuthManager,
        constructor: window.AuthManager ? window.AuthManager.constructor.name : 'N/A',
        hasPromptMethod: window.AuthManager ? typeof window.AuthManager.generatePromptWithInstructions === 'function' : false,
        methods: window.AuthManager ? Object.getOwnPropertyNames(Object.getPrototypeOf(window.AuthManager)) : []
    });
    
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
        console.error('Failed to initialize the application. Check the console for details.');
    }
});

// Add reset functionality to window for debugging
window.resetApp = () => app.resetAllData();

// Debug function to test AuthManager
window.testAuthManager = () => {
    console.log('🧪 Testing AuthManager...');
    if (!window.AuthManager) {
        console.error('❌ AuthManager not found');
        return;
    }
    
    console.log('✅ AuthManager exists');
    console.log('📋 Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.AuthManager)));
    
    if (typeof window.AuthManager.generatePromptWithInstructions === 'function') {
        console.log('✅ generatePromptWithInstructions method found');
    } else {
        console.error('❌ generatePromptWithInstructions method NOT found');
    }
    
    console.log('🔑 API Keys status:', {
        hasOpenAI: !!window.AuthManager.apiKeys?.openai,
        hasReplicate: !!window.AuthManager.apiKeys?.replicate
    });
};
