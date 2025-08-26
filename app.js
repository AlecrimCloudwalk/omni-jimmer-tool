    /**
     * Main application logic for Omni Jimmer Tool - Portuguese/Brazilian Version
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
            this.carouselTimer = null;
            this.maxMatrixSize = 15; // 15x15 maximum
            this.productSeeds = {}; // Store seeds for each product

            // Initialize new modular prompt builder
            this.promptBuilder = new PromptBuilder();
            
            // Initialize pricing calculator
            this.pricing = new PricingCalculator();

            // Brazilian characteristics system - enhanced version
            this.brazilianCharacteristics = {
                // 30 Brazilian cities - mix of major capitals and lesser-known cities
                cities: [
                    // Major capitals
                    'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
                    'Belo Horizonte', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém',
                    'Goiânia', 'Manaus', 'São Luís', 'Maceió', 'Natal',
                    'João Pessoa', 'Aracaju', 'Teresina', 'Cuiabá', 'Campo Grande',
                    // Lesser-known but significant cities
                    'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba', 'Niterói',
                    'Feira de Santana', 'Juiz de Fora', 'Londrina', 'Joinville', 'Caxias do Sul'
                ],
                
                // Time of day options in Portuguese
                timesOfDay: [
                    'amanhecer',
                    'entardecer', 
                    'noite',
                    'meio-dia',
                    'golden hour'
                ],
                
                // Brazilian ethnicities
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
                
                // Color system with specified percentages
                clothingColors: {
                    // 40% earth tones
                    earthTones: [
                        'roupa bege claro',
                        'roupa marrom claro', 
                        'roupa creme',
                        'roupa terra',
                        'roupa caramelo',
                        'roupa areia',
                        'roupa café com leite',
                        'roupa bronze'
                    ],
                    // 20% white
                    white: [
                        'roupa branca',
                        'roupa off-white',
                        'roupa marfim'
                    ],
                    // 20% black  
                    black: [
                        'roupa preta',
                        'roupa preto fosco',
                        'roupa preto elegante'
                    ],
                    // 10% lime/avocado green
                    limeAvocado: [
                        'roupa verde lima suave',
                    ],
                    // 10% soft violet/light purple
                    softViolet: [
                        'roupa lilás suave',
                        'roupa lavanda pálida',
                        'roupa roxo claro',
                        'roupa violeta suave'
                    ]
                },
                
                // Age range 30-50
                ageRange: {
                    min: 30,
                    max: 50
                }
            };

        this.initializeDefaults();
        this.setupEventListeners();
        this.loadStoredData();
        this.renderMatrix();
        
        // Initialize AuthManager reference
        this.authManager = null;
        this.initAuthManager();
        
        // Setup overflow detection for gradient fade effects
        this.setupOverflowDetection();
        
        // Prompt tab positioning no longer needed
    }

    /**
     * Initialize with default CNAEs and products - Brazilian focused
     */
    initializeDefaults() {
        // Default CNAEs with MCC codes for Brazilian business classifications
        this.defaultCnaes = [
            { name: 'Restaurante', mcc: '5611' },
            { name: 'Padaria', mcc: '5461' },
            { name: 'Farmácia', mcc: '5912' },
            { name: 'Loja de Roupa', mcc: '5651' },
            { name: 'Salão de Beleza', mcc: '7211' },
            { name: 'Barbearia', mcc: '7211' },
            { name: 'Oficina Mecânica', mcc: '7538' },
            { name: 'Clínicas / Odonto / Estética', mcc: '8011' },
            { name: 'Mercadinho', mcc: '5411' },
            { name: 'Açougue', mcc: '5422' },
            { name: 'Tatuagem', mcc: '7211' },
            { name: 'Loja de Eletrônicos', mcc: '5732' }
        ];

        // Default product types - Brazilian fintech/payment products
        this.defaultProducts = [
            { name: 'Reduza taxas (Piselli)', prompt: 'Retrato heroico do(a) empreendedor(a) segurando um smartphone à altura do peito, tela voltada para a câmera. Postura ereta e confiante, transmitindo profissionalismo e eficiência.' },
            { name: 'Referral', prompt: 'Retrato do(a) empreendedor(a) ao lado de uma vitrine ou expositor, conversando com um(a) cliente à frente. Postura firme, leve gesto com as mãos e contato visual, sugerindo confiança e indicação.' },
            { name: 'Pix Crédito', prompt: 'Duas pessoas frente a frente, cada uma estendendo seu smartphone; os aparelhos se tocam em gesto de pagamento telefone-a-telefone. Cena simétrica sobre um balcão organizado com produtos.' },
            { name: 'Gestão de cobranças', prompt: 'Retrato do(a) proprietário(a) sentado(a) à mesa com notebook aberto, levemente inclinado(a) para frente, em foco. Fundo com itens do negócio suavemente desfocado. Expressão concentrada.' },
            { name: 'Tap', prompt: 'Duas pessoas em perfis opostos, separadas por um balcão. Cada uma estende o smartphone na mesma altura; os aparelhos encostam lateralmente em gesto de pagamento por aproximação. Fundo de loja desfocado.' },
            { name: 'Criar Boleto', prompt: 'Empreendedor(a) de pé próximo ao balcão, olhando para o smartphone com leve sorriso. Uma mão apoia no balcão, a outra segura o celular mostrando as costas do aparelho. Ambiente organizado ao fundo.' },
            { name: 'Cartão', prompt: 'Close-up de uma mão segurando um smartphone mostrando as costas do aparelho. Fundo desfocado de ambiente comercial moderno e iluminado.' },
            { name: 'Pagar Boleto', prompt: 'Retrato do(a) profissional sentado(a) no posto de trabalho, notebook à frente e smartphone na mão mostrando as costas do aparelho. Postura ereta e confiante. Fundo do negócio suavemente desfocado.' },
            { name: 'POS', prompt: 'Retrato heroico do(a) empreendedor(a) no espaço de trabalho, segurando em destaque um smartphone ou terminal POS voltado para a câmera. Postura orgulhosa e acessível, fundo autêntico do negócio desfocado.' },
            { name: 'InfiniteCash', prompt: 'Plano aberto em ângulo baixo para sensação de grandeza: empreendedor(a) em posição central, postura firme e mão no quadril; na outra mão, um smartphone visível mostrando as costas. Ambiente organizado ao redor.' },
            { name: 'Instant Settlement', prompt: 'Empreendedor(a) em pé próximo ao caixa ou balcão do estabelecimento. Segura o celular em uma mão, mostrando as costas do aparelho, como se acompanhasse vendas. Expressão segura e profissional; ambiente de loja organizado ao fundo.' }
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
        const resetAllBtn = document.getElementById('reset-all-data');
        const fullPurgeBtn = document.getElementById('full-purge');
        const resetPromptsBtn = document.getElementById('reset-prompts');
        const resetImagesBtn = document.getElementById('reset-images');
        const resetProductsBtn = document.getElementById('reset-products');
        const resetCnaesBtn = document.getElementById('reset-cnaes');
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
        
        // Granular reset buttons
        if (resetPromptsBtn) {
            resetPromptsBtn.addEventListener('click', () => {
                const confirmed = confirm('🗑️ Resetar todos os prompts gerados? (Imagens serão preservadas)');
                if (confirmed) {
                    this.resetAllPrompts();
                }
            });
            console.log('✅ Reset prompts button listener added');
        }
        
        if (resetImagesBtn) {
            resetImagesBtn.addEventListener('click', () => {
                const confirmed = confirm('🗑️ Deletar todas as imagens geradas? (Prompts serão preservados)');
                if (confirmed) {
                    this.resetAllImages();
                }
            });
            console.log('✅ Reset images button listener added');
        }
        
        if (resetProductsBtn) {
            resetProductsBtn.addEventListener('click', () => {
                const confirmed = confirm('🗑️ Resetar lista de produtos para os padrões fintech brasileiros?');
                if (confirmed) {
                    this.resetProducts();
                }
            });
            console.log('✅ Reset products button listener added');
        }
        
        if (resetCnaesBtn) {
            resetCnaesBtn.addEventListener('click', () => {
                const confirmed = confirm('🗑️ Resetar lista de CNAEs para os padrões brasileiros?');
                if (confirmed) {
                    this.resetCnaes();
                }
            });
            console.log('✅ Reset CNAEs button listener added');
        }
        
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                const confirmed = confirm('⚠️ ATENÇÃO: Isso irá resetar TODOS os dados (CNAEs, produtos, matriz, prompts, imagens) para os padrões brasileiros. Esta ação não pode ser desfeita. Continuar?');
                if (confirmed) {
                    this.resetAllData();
                }
            });
            console.log('✅ Reset all data button listener added');
        }

        if (fullPurgeBtn) {
            fullPurgeBtn.addEventListener('click', () => {
                const confirmed = confirm('🗑️ FULL PURGE: Isso irá APAGAR TODO CONTEÚDO GERADO (prompts, imagens, vídeos) mantendo apenas suas configurações de CNAEs e produtos. Esta ação não pode ser desfeita. Continuar?');
                if (confirmed) {
                    const doubleConfirm = confirm('⚠️ ÚLTIMA CONFIRMAÇÃO: Tem certeza de que deseja apagar TUDO que foi gerado? Isso incluirá todos os prompts, imagens e vídeos criados.');
                    if (doubleConfirm) {
                        this.fullPurgeGenerated();
                    }
                }
            });
            console.log('✅ Full purge button listener added');
        }

        // Global style prompt controls
        const saveStyleBtn = document.getElementById('save-style-prompt');
        const resetStyleBtn = document.getElementById('reset-style-prompt');
        const styleTextarea = document.getElementById('global-style-prompt');
        
        if (saveStyleBtn && styleTextarea) {
            saveStyleBtn.addEventListener('click', () => {
                console.log('🎬 Save style button clicked');
                this.saveGlobalStylePrompt();
            });
            console.log('✅ Save style prompt button listener added');
        } else {
            console.warn('⚠️ Save style button or textarea not found:', { saveStyleBtn: !!saveStyleBtn, styleTextarea: !!styleTextarea });
        }
        
        if (resetStyleBtn && styleTextarea) {
            resetStyleBtn.addEventListener('click', () => {
                console.log('🔄 Reset style button clicked');
                this.resetGlobalStylePrompt();
            });
            console.log('✅ Reset style prompt button listener added');
        } else {
            console.warn('⚠️ Reset style button or textarea not found:', { resetStyleBtn: !!resetStyleBtn, styleTextarea: !!styleTextarea });
        }

        // Demo carousel
        document.getElementById('demo-cnae-select').addEventListener('change', (e) => this.loadDemoCarousel(e.target.value));
        
        // Set up phone carousel navigation
        this.setupPhoneCarousel();

        // Click-and-hold functionality for row controls
        this.setupClickAndHoldControls();
        
        // Setup collapsible sidebar functionality
        this.setupSidebar();
        
        // Setup phone preview panel functionality
        this.setupPhonePanel();
        
        // Setup prompts toggle button (border setup happens after matrix render)
        this.setupPromptsButton();
        
        // Initialize demo with first CNAE if available
        this.initializeDemoPreview();
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
        } else {
            // For new installations or when no global style is stored, 
            // make sure UI shows the new Brazilian camera settings default
            console.log('🎬 Using new Brazilian camera settings as default global prompt');
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
     * Generate image from modal with pricing
     */
    async modalGenerateImage() {
        console.log('🚀 modalGenerateImage() called!');
        const btn = document.getElementById('generate-image-text') || document.getElementById('generate-image-btn');
        const dropArea = document.getElementById('drop-area');
        
        // Show pricing estimate
        const estimate = this.pricing.getOperationEstimate('image', 1);
        const confirmed = await this.showPricingConfirmation('Generate Image', [
            {
                title: 'Image Generation',
                description: estimate.description,
                cost: estimate.cost
            }
        ]);
        
        if (!confirmed) return;
        
        btn.textContent = 'Generating...';
        
        // Show loading in drop area
        if (dropArea) {
            dropArea.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; background: #161518; border-radius: 12px;">
                    <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="max-height: 80px; width: 100%; object-fit: cover; margin-bottom: 16px; border-radius: 8px;">
                    <div style="color: var(--text); font-size: 16px; font-weight: 500;">Generating image...</div>
                    <div style="color: var(--muted); font-size: 14px; margin-top: 8px;">This may take a moment</div>
                </div>
            `;
            dropArea.classList.remove('has-image');
        }
        
        try {
            await this.generateImageFromPrompt(this.currentCellKey);
            
            const cellData = this.matrixData[this.currentCellKey];
            if (cellData && cellData.imageUrl) {
                // Show generated image in drop area
                this.showImageInDropArea(cellData.imageUrl, 'Generated image', 'Click to regenerate or upload new image');
                
                // Store the original generated image for processing
                this.originalImageData = cellData.imageUrl;
                this.currentImageData = cellData.imageUrl;
                
                this.markStepCompleted(2);
                this.showStatus('image-status', '✅ Image generated successfully!', 'success');
                
                // Enable video generation
                const generateVideoBtn = document.getElementById('generate-video-btn');
                if (generateVideoBtn) generateVideoBtn.disabled = false;
                
                // Auto-switch to next step after short delay
                setTimeout(() => {
                    this.switchToStep(3);
                }, 1500);
            }
        } catch (error) {
            this.showStatus('image-status', '❌ Error generating image', 'error');
            
            // Reset drop area to original state on error
            if (dropArea) {
                dropArea.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; text-align: center; padding: 20px;">
                        <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px; color: var(--text);">
                            Drag & drop your image here or click to browse
                        </div>
                        <div style="font-size: 14px; opacity: 0.7; color: var(--muted);">
                            Supports JPG, PNG, WebP up to 10MB
                        </div>
                    </div>
                `;
                dropArea.classList.remove('has-image');
            }
        }
        
        btn.textContent = 'Regenerate Image';
    }

    /**
     * Generate video from existing image and prompt (for bulk generation)
     */
    async generateVideoFromImageAndPrompt(cellKey) {
        const cellData = this.matrixData[cellKey];
        if (!cellData || !cellData.imageUrl || !cellData.prompt) {
            this.showMessage('Cell must have both image and prompt for video generation', 'error');
            return;
        }

        this.matrixData[cellKey].status = 'generating_video';
        this.renderMatrix();
        this.saveData();

        try {
            const videoUrls = await window.AuthManager.generateVideo(cellData.prompt, cellData.imageUrl);
            const videoUrl = Array.isArray(videoUrls) ? videoUrls[0] : videoUrls;

            this.matrixData[cellKey] = {
                ...cellData,
                status: 'video_generated',
                videoUrl: videoUrl,
                videoGeneratedAt: new Date().toISOString()
            };

            this.renderMatrix();
            this.saveData();
            
        } catch (error) {
            console.error('Video generation failed:', error);
            this.matrixData[cellKey] = { 
                ...cellData,
                status: 'error',
                error: error.message
            };
            this.renderMatrix();
            this.saveData();
            this.showMessage(`Video generation failed: ${error.message}`, 'error');
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
        
        // Show dynamic characteristics (read-only) using new enhanced Brazilian format
        const seedInfo = this.getSeededCharacteristics(this.getProductSeed(productName));
        characteristicsDiv.textContent = `${seedInfo.age} anos, ${seedInfo.ethnicity}, ${seedInfo.clothingColor}, ${seedInfo.timeOfDay}, ${seedInfo.city}`;
        
        // Reset workflow steps first
        this.resetWorkflowSteps();
        
        if (cellData) {
            if (cellData.prompt) {
                promptEditor.value = cellData.prompt;
                // Mark step as completed after reset
                setTimeout(() => this.markStepCompleted(1), 50);
                
                // Update button text to "Regenerate Prompt"
                const generatePromptBtn = document.getElementById('generate-prompt-text') || document.getElementById('generate-prompt-btn');
                if (generatePromptBtn) {
                    if (generatePromptBtn.tagName === 'SPAN') {
                        generatePromptBtn.textContent = 'Regenerate Prompt';
                    } else {
                        generatePromptBtn.textContent = 'Regenerate Prompt';
                    }
                }
                
                const generateImageBtn = document.getElementById('generate-image-btn');
                if (generateImageBtn) generateImageBtn.disabled = false;
            }
            
            if (cellData.imageUrl) {
                // Show existing image in drop area
                this.showImageInDropArea(cellData.imageUrl, 'Generated image', 'Click to regenerate or upload new image');
                
                // Store the image data for processing
                this.originalImageData = cellData.imageUrl;
                this.currentImageData = cellData.imageUrl;
                
                // If there's a processed image, use that instead
                if (cellData.processedImageData) {
                    this.processedImageData = cellData.processedImageData;
                }
                
                // Mark step as completed after reset
                setTimeout(() => this.markStepCompleted(2), 100);
                
                // Update image button text since we already have an image
                const generateImageBtn = document.getElementById('generate-image-text') || document.getElementById('generate-image-btn');
                if (generateImageBtn) {
                    if (generateImageBtn.tagName === 'SPAN') {
                        generateImageBtn.textContent = 'Regenerate Image';
                    } else {
                        generateImageBtn.textContent = 'Regenerate Image';
                    }
                }
            }
            
            // Handle status-based states (generating/error are now handled through status messages)
            if (cellData.status === 'generating') {
                // Show appropriate loading state based on what's generating
                if (cellData.prompt && !cellData.imageUrl) {
                    // Image is generating
                    this.showStatus('image-status', '🎨 Generating image...', 'success');
                } else {
                    // Prompt is generating
                    this.showStatus('prompt-status', '🤖 Generating prompt...', 'success');
                }
            }
            
            if (cellData.status === 'error') {
                const errorStep = cellData.prompt ? 2 : 1;
                const statusId = errorStep === 1 ? 'prompt-status' : 'image-status';
                this.showStatus(statusId, '❌ Generation failed', 'error');
            }
        } else {
            promptEditor.value = '';
        }
    }

    /**
     * Setup modal event listeners
     */
    setupModalEventListeners() {
        console.log('🔧 Setting up modal event listeners...');
        
        // Wait for DOM elements to be available
        setTimeout(() => {
            // Setup prompt generation button
            const generatePromptBtn = document.getElementById('generate-prompt-btn');
            console.log('🔍 Generate Prompt Button:', generatePromptBtn);
            if (generatePromptBtn) {
                generatePromptBtn.onclick = (e) => {
                    console.log('🎯 Generate Prompt clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.modalGeneratePrompt();
                };
                console.log('✅ Prompt button event listener set');
            } else {
                console.warn('⚠️ Generate Prompt button not found');
            }

            // Setup image generation button  
            const generateImageBtn = document.getElementById('generate-image-btn');
            console.log('🔍 Generate Image Button:', generateImageBtn);
            if (generateImageBtn) {
                generateImageBtn.onclick = (e) => {
                    console.log('🎯 Generate Image clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.modalGenerateImage();
                };
                console.log('✅ Image button event listener set');
            } else {
                console.warn('⚠️ Generate Image button not found');
            }

            // Setup video generation button
            const generateVideoBtn = document.getElementById('generate-video-btn');
            console.log('🔍 Generate Video Button:', generateVideoBtn);
            if (generateVideoBtn) {
                generateVideoBtn.onclick = (e) => {
                    console.log('🎯 Generate Video clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.modalGenerateVideo();
                };
                console.log('✅ Video button event listener set');
            } else {
                console.warn('⚠️ Generate Video button not found');
            }

            // Setup edit/save buttons
            const editImageBtn = document.getElementById('edit-image-btn');
            if (editImageBtn) {
                editImageBtn.onclick = () => this.toggleImageEditor();
            }

            const saveImageBtn = document.getElementById('save-image-btn');
            if (saveImageBtn) {
                saveImageBtn.onclick = () => this.saveImageEdits();
            }
            
            // File input listener
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.onchange = (e) => this.handleFileSelect(e);
            }
            
            // Prompt editor auto-save
            const promptEditor = document.getElementById('prompt-editor');
            if (promptEditor) {
                promptEditor.addEventListener('input', (e) => {
                    // Auto-save prompt changes after user stops typing for 1 second
                    clearTimeout(this.promptSaveTimeout);
                    this.promptSaveTimeout = setTimeout(() => {
                        this.autoSavePrompt(e.target.value);
                    }, 1000);
                });
            }

            // Video settings listeners
            const videoModelSelect = document.getElementById('video-model-select');
            const videoDurationSelect = document.getElementById('video-duration-select');
            
            if (videoModelSelect) {
                videoModelSelect.addEventListener('change', () => this.updateVideoPricing());
            }
            
            if (videoDurationSelect) {
                videoDurationSelect.addEventListener('change', () => this.updateVideoPricing());
            }
            
            console.log('🔧 Modal event listeners setup completed');
        }, 100);
        
        // Setup drag and drop
        this.setupDragAndDrop();
        
        // Setup image sliders
        this.setupImageSliders();
        
        // Initialize sidebar modal
        this.currentModalStep = 1;
        if (!this.completedSteps) {
            this.completedSteps = new Set();
        }
        // Initialize image transform state
        this.imageTransform = {
            scale: 1,
            translateX: 0,
            translateY: 0
        };
        // Update progress immediately when modal opens
        setTimeout(() => {
            this.updateProgress();
            this.updateVideoPricing(); // Initialize video pricing display
            this.setupSyncedPromptSync(); // Setup synced prompt box
        }, 100);
    }



    /**
     * Generate prompt from modal
     */
    async modalGeneratePrompt() {
        console.log('🚀 modalGeneratePrompt() called!');
        const btn = document.getElementById('generate-prompt-text') || document.getElementById('generate-prompt-btn');
        
        // Show pricing estimate
        const estimate = this.pricing.getOperationEstimate('prompt', 1);
        const confirmed = await this.showPricingConfirmation('Generate Prompt', [
            {
                title: 'Prompt Generation',
                description: estimate.description,
                cost: estimate.cost
            }
        ]);
        
        if (!confirmed) return;
        
        btn.textContent = 'Generating...';
        
        try {
            await this.generatePromptForCell(this.currentCellKey);
            const cellData = this.matrixData[this.currentCellKey];
            if (cellData && cellData.prompt) {
                document.getElementById('prompt-editor').value = cellData.prompt;
                
                this.markStepCompleted(1);
                this.showStatus('prompt-status', '✅ Prompt generated successfully!', 'success');
                
                // Enable image generation
                const generateImageBtn = document.getElementById('generate-image-btn');
                if (generateImageBtn) generateImageBtn.disabled = false;
                
                // Auto-switch to next step after short delay
                setTimeout(() => {
                    this.switchToStep(2);
                }, 1500);
            }
        } catch (error) {
            this.showStatus('prompt-status', '❌ Error generating prompt', 'error');
        }
        
        btn.textContent = 'Regenerate Prompt';
    }

    /**
     * Auto-save prompt when user types
     */
    autoSavePrompt(prompt) {
        if (!this.currentCellKey) return;
        
        prompt = prompt.trim();
        if (!prompt) return; // Don't save empty prompts
        
        // Update the cell data
        this.matrixData[this.currentCellKey] = {
            ...this.matrixData[this.currentCellKey],
            prompt: prompt,
            status: 'prompt_ready'
        };
        
        // Save to storage
        this.saveData();
        this.renderMatrix();
        
        // Mark step as completed if it has content
        if (prompt.length > 10) { // Minimum meaningful prompt length
            this.markStepCompleted(1);
            
            // Enable image generation
            const generateImageBtn = document.getElementById('generate-image-btn');
            if (generateImageBtn) generateImageBtn.disabled = false;
        }
    }



    /**
     * Generate video for current cell (modal version)
     */
    async modalGenerateVideo() {
        console.log('🚀 modalGenerateVideo() called!');
        const btn = document.getElementById('generate-video-text') || document.getElementById('generate-video-btn');
        const videoPreviewArea = document.getElementById('video-preview-area');
        const videoPlaceholder = document.getElementById('video-placeholder');
        
        const cellData = this.matrixData[this.currentCellKey];
        if (!cellData || !cellData.imageUrl) {
            this.showStatus('video-status', '❌ Image required for video generation', 'error');
            return;
        }

        // Get current video settings
        const videoModel = document.getElementById('video-model-select')?.value || 'seedanceLite';
        const videoDuration = parseInt(document.getElementById('video-duration-select')?.value || 5);
        
        // Show pricing estimate
        const estimate = this.pricing.getOperationEstimate('video', 1);
        this.pricing.setVideoSettings(videoModel, videoDuration);
        
        const confirmed = await this.showPricingConfirmation('Generate Video', [
            {
                title: 'Video Generation',
                description: `1 video (${this.pricing.getVideoModelName(videoModel)}, ${videoDuration}s)`,
                cost: this.pricing.calculateVideoCost(1, videoModel, videoDuration)
            }
        ]);
        
        if (!confirmed) return;

        btn.textContent = 'Generating...';
        if (videoPreviewArea) {
            videoPreviewArea.classList.add('generating');
            if (videoPlaceholder) {
                videoPlaceholder.classList.add('loading');
                videoPlaceholder.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px;">
                        <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px; position: absolute; top: 0; left: 0; z-index: 1;">
                        <div style="font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                            🎬 Generating video...
                        </div>
                        <div style="font-size: 14px; color: var(--muted); text-align: center; line-height: 1.4;">
                            ${this.pricing.getVideoModelName(videoModel)} - ${videoDuration}s<br/>
                            <span style="opacity: 0.7;">This may take several minutes</span>
                        </div>
                    </div>
                `;
            }
        }
        this.showStatus('video-status', '🎬 Generating video (this may take a few minutes)...', 'success');

        try {
            const videoUrls = await window.AuthManager.generateVideo(cellData.prompt, cellData.imageUrl, {
                duration: videoDuration
            });
            const videoUrl = Array.isArray(videoUrls) ? videoUrls[0] : videoUrls;

            // Update cell data with video
            this.matrixData[this.currentCellKey] = {
                ...cellData,
                videoUrl: videoUrl,
                videoGeneratedAt: new Date().toISOString(),
                videoSettings: { model: videoModel, duration: videoDuration }
            };

            // Show video in preview area
            if (videoPreviewArea && videoPlaceholder) {
                videoPreviewArea.classList.remove('generating');
                videoPreviewArea.classList.add('has-video');
                videoPlaceholder.classList.remove('loading');
                videoPlaceholder.innerHTML = `
                    <video controls autoplay muted loop style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                        <source src="${videoUrl}" type="video/mp4">
                        <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" alt="Video loading...">
                        Your browser does not support the video tag.
                    </video>
                    <div class="video-controls">
                        <button class="video-control-btn" onclick="app.downloadVideo('${videoUrl}')">⬇️</button>
                    </div>
                `;
            }

            this.saveData();
            this.updateProgress();
            this.showStatus('video-status', '✅ Video generated successfully!', 'success');

            // Auto-advance or complete workflow
            setTimeout(() => {
                this.showStatus('video-status', '🎉 All steps completed!', 'success');
            }, 1500);

        } catch (error) {
            console.error('Video generation failed:', error);
            
            // Reset UI state
            if (videoPreviewArea) {
                videoPreviewArea.classList.remove('generating');
                if (videoPlaceholder) {
                    videoPlaceholder.classList.remove('loading');
                    videoPlaceholder.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px;">
                            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.6;">❌</div>
                            <div style="font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 8px;">
                                Video generation failed
                            </div>
                            <div style="font-size: 14px; color: var(--muted); text-align: center; line-height: 1.4; opacity: 0.8;">
                                ${error.message || 'Unknown error occurred'}
                            </div>
                        </div>
                    `;
                }
            }
            
            this.showStatus('video-status', `❌ Video generation failed: ${error.message}`, 'error');
        } finally {
            btn.textContent = 'Regenerate Video';
        }
    }

    /**
     * Reset workflow steps (for sidebar modal)
     */
    resetWorkflowSteps() {
        // Reset sidebar navigation states
        document.querySelectorAll('.nav-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        // Set first step as active
        const firstStep = document.querySelector('.nav-step[data-step="1"]');
        if (firstStep) firstStep.classList.add('active');
        
        // Reset step content visibility
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show first step content
        const firstContent = document.getElementById('step-content-1');
        if (firstContent) firstContent.classList.add('active');
        
        // Reset button states and text
        const generatePromptBtn = document.getElementById('generate-prompt-text') || document.getElementById('generate-prompt-btn');
        const generateImageBtn = document.getElementById('generate-image-btn');
        const generateImageText = document.getElementById('generate-image-text');
        const editImageBtn = document.getElementById('edit-image-btn');
        const saveImageBtn = document.getElementById('save-image-btn');
        const imageControls = document.getElementById('image-controls');
        
        // Reset prompt button text
        if (generatePromptBtn) {
            if (generatePromptBtn.tagName === 'SPAN') {
                generatePromptBtn.textContent = 'Generate Prompt';
            } else {
                generatePromptBtn.textContent = 'Generate Prompt';
            }
        }
        
        // Reset image button
        if (generateImageBtn) generateImageBtn.disabled = true;
        if (generateImageText) generateImageText.textContent = 'Generate Image';
        if (editImageBtn) editImageBtn.style.display = 'none';
        if (saveImageBtn) saveImageBtn.style.display = 'none';
        if (imageControls) {
            imageControls.style.display = 'none';
            imageControls.classList.remove('show');
        }
        
        // Reset progress
        this.currentModalStep = 1;
        this.completedSteps = new Set();
        this.updateProgress();
    }

    /**
     * Set workflow step as completed (deprecated - use markStepCompleted instead)
     */
    setWorkflowStepCompleted(stepNumber) {
        this.markStepCompleted(stepNumber);
    }

    /**
     * Set workflow step as generating (deprecated)
     */
    setWorkflowStepGenerating(stepNumber) {
        // For sidebar modal, we don't need generating state
        // Status is shown through loading indicators in buttons
    }

    /**
     * Set workflow step as error (deprecated)
     */
    setWorkflowStepError(stepNumber) {
        // For sidebar modal, errors are shown through status messages
        // this.showStatus() handles error display
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
     * Switch to step in sidebar modal
     */
    switchToStep(stepNumber) {
        // Update navigation
        document.querySelectorAll('.nav-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.nav-step[data-step="${stepNumber}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`step-content-${stepNumber}`).classList.add('active');

        this.currentModalStep = stepNumber;
        
        // Update synced prompt box visibility
        this.updateSyncedPromptBox(stepNumber);
    }

    /**
     * Update progress bar in modal
     */
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        if (progressFill && progressText) {
            const percentage = (this.completedSteps.size / 3) * 100;
            
            progressFill.style.width = percentage + '%';
            progressText.textContent = `${this.completedSteps.size} of 3 steps completed`;

            // Update navigation step states
            this.completedSteps.forEach(step => {
                const navStep = document.querySelector(`.nav-step[data-step="${step}"]`);
                if (navStep) navStep.classList.add('completed');
            });
        }
    }

    /**
     * Mark step as completed
     */
    markStepCompleted(stepNumber) {
        this.completedSteps.add(stepNumber);
        this.updateProgress();
    }

    /**
     * Update synced prompt box visibility and content
     */
    updateSyncedPromptBox(stepNumber) {
        const syncedPromptBox = document.getElementById('synced-prompt-box');
        const syncedPromptTextarea = document.getElementById('synced-prompt-textarea');
        const promptEditor = document.getElementById('prompt-editor');
        
        if (!syncedPromptBox || !syncedPromptTextarea) return;
        
        // Hide on step 1 (prompt step), show on steps 2 and 3
        if (stepNumber === 1) {
            syncedPromptBox.classList.add('hidden');
        } else {
            syncedPromptBox.classList.remove('hidden');
            
            // Sync content from main prompt editor
            if (promptEditor) {
                syncedPromptTextarea.value = promptEditor.value;
                // Make it editable and sync back to main editor
                syncedPromptTextarea.readOnly = false;
                
                // Setup two-way sync
                if (!syncedPromptTextarea.hasAttribute('data-synced')) {
                    syncedPromptTextarea.addEventListener('input', () => {
                        if (promptEditor) {
                            promptEditor.value = syncedPromptTextarea.value;
                            // Auto-save prompt when user types
                            this.autoSavePrompt(syncedPromptTextarea.value);
                        }
                    });
                    syncedPromptTextarea.setAttribute('data-synced', 'true');
                }
            }
        }
    }

    /**
     * Setup modal content sync for synced prompt box
     */
    setupSyncedPromptSync() {
        const promptEditor = document.getElementById('prompt-editor');
        const syncedPromptTextarea = document.getElementById('synced-prompt-textarea');
        
        if (promptEditor && syncedPromptTextarea) {
            // Setup one-way sync from main editor to synced box initially
            promptEditor.addEventListener('input', () => {
                if (!syncedPromptTextarea.classList.contains('hidden')) {
                    syncedPromptTextarea.value = promptEditor.value;
                }
            });
        }
    }

    /**
     * Show status message
     */
    showStatus(elementId, message, type) {
        const statusEl = document.getElementById(elementId);
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-message ${type} show`;
            setTimeout(() => {
                statusEl.classList.remove('show');
            }, 4000);
        }
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        const dropArea = document.getElementById('drop-area');
        if (!dropArea) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
        });

        dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFiles(files);
        }, false);
    }

    /**
     * Prevent default drag behaviors
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Handle file selection
     */
    handleFileSelect(event) {
        const files = event.target.files;
        this.handleFiles(files);
    }

    /**
     * Handle dropped/selected files
     */
    handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
                this.uploadedImage = file;
                this.displayUploadedImage(file);
            } else {
                this.showStatus('image-status', '❌ Please upload a valid image file under 10MB', 'error');
            }
        }
    }

    /**
     * Display uploaded image in drag area
     */
    displayUploadedImage(file) {
        const dropArea = document.getElementById('drop-area');
        if (!dropArea) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImageData = e.target.result;
            this.showImageInDropArea(e.target.result, 'Uploaded image', 'Click to change image');
            
            const generateBtn = document.getElementById('generate-image-btn');
            const editBtn = document.getElementById('edit-image-btn');
            
            if (generateBtn) generateBtn.disabled = false;
            if (editBtn) editBtn.style.display = 'inline-block';
            
            this.markStepCompleted(2);
            this.showStatus('image-status', '✅ Image uploaded successfully!', 'success');
        };

        reader.readAsDataURL(file);
    }

    /**
     * Show image in drag-drop area (unified function for uploaded and generated images)
     */
    showImageInDropArea(imageSrc, altText = 'Image', overlayText = 'Click to change image') {
        const dropArea = document.getElementById('drop-area');
        if (!dropArea) return;

        // Store the current image data
        this.currentImageData = imageSrc;

        dropArea.innerHTML = `
            <img id="modal-image" src="${imageSrc}" alt="${altText}" class="uploaded-image">
            <div class="image-overlay">
                <div style="color: white; font-weight: 500;">${overlayText}</div>
            </div>
        `;
        dropArea.classList.add('has-image');
        
        // Reset transforms when showing new image
        this.resetImageTransform();
        
        // Show edit button for uploaded/generated images
        const editBtn = document.getElementById('edit-image-btn');
        if (editBtn) editBtn.style.display = 'inline-block';
    }

    /**
     * Setup image sliders
     */
    setupImageSliders() {
        const scaleSlider = document.getElementById('scale-slider');
        const posXSlider = document.getElementById('pos-x-slider');
        const posYSlider = document.getElementById('pos-y-slider');

        const scaleValue = document.getElementById('scale-value');
        const posXValue = document.getElementById('pos-x-value');
        const posYValue = document.getElementById('pos-y-value');

        if (scaleSlider) {
            scaleSlider.addEventListener('input', (e) => {
                this.imageTransform.scale = parseFloat(e.target.value);
                scaleValue.textContent = e.target.value;
                this.applyImageTransform();
            });
        }

        if (posXSlider) {
            posXSlider.addEventListener('input', (e) => {
                this.imageTransform.translateX = parseInt(e.target.value);
                posXValue.textContent = e.target.value + 'px';
                this.applyImageTransform();
            });
        }

        if (posYSlider) {
            posYSlider.addEventListener('input', (e) => {
                this.imageTransform.translateY = parseInt(e.target.value);
                posYValue.textContent = e.target.value + 'px';
                this.applyImageTransform();
            });
        }
    }

    /**
     * Apply image transform
     */
    applyImageTransform() {
        const image = document.getElementById('modal-image');
        if (!image) return;

        const { scale, translateX, translateY } = this.imageTransform;
        image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    /**
     * Reset image transform
     */
    resetImageTransform() {
        this.imageTransform = {
            scale: 1,
            translateX: 0,
            translateY: 0
        };

        // Update slider values
        const scaleSlider = document.getElementById('scale-slider');
        const posXSlider = document.getElementById('pos-x-slider');
        const posYSlider = document.getElementById('pos-y-slider');
        const scaleValue = document.getElementById('scale-value');
        const posXValue = document.getElementById('pos-x-value');
        const posYValue = document.getElementById('pos-y-value');

        if (scaleSlider) {
            scaleSlider.value = 1;
            scaleValue.textContent = '1.0';
        }
        if (posXSlider) {
            posXSlider.value = 0;
            posXValue.textContent = '0';
        }
        if (posYSlider) {
            posYSlider.value = 0;
            posYValue.textContent = '0';
        }

        this.applyImageTransform();
    }

    /**
     * Toggle image editor
     */
    toggleImageEditor() {
        const container = document.getElementById('image-controls');
        const saveBtn = document.getElementById('save-image-btn');
        const editBtn = document.getElementById('edit-image-btn');
        
        if (container && saveBtn && editBtn) {
            if (container.style.display === 'none') {
                container.style.display = 'block';
                container.classList.add('show');
                saveBtn.style.display = 'inline-block';
                editBtn.style.display = 'none';
            } else {
                container.style.display = 'none';
                container.classList.remove('show');
                saveBtn.style.display = 'none';
                editBtn.style.display = 'inline-block';
            }
        }
    }

    /**
     * Save image edits - capture the transformed image
     */
    async saveImageEdits() {
        try {
            const image = document.getElementById('modal-image');
            if (!image) return;

            // Create a canvas to capture the transformed image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size to match the drag area
            const dropArea = document.getElementById('drop-area');
            canvas.width = dropArea.offsetWidth;
            canvas.height = dropArea.offsetHeight;

            // Create a new image to load the current image data
            const sourceImage = new Image();
            sourceImage.onload = () => {
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Apply transforms
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(this.imageTransform.scale, this.imageTransform.scale);
                ctx.translate(this.imageTransform.translateX, this.imageTransform.translateY);
                
                // Draw the image centered
                ctx.drawImage(sourceImage, -sourceImage.width / 2, -sourceImage.height / 2);
                ctx.restore();

                // Get the processed image data
                const processedImageData = canvas.toDataURL('image/jpeg', 0.9);
                
                // Store the processed image for video generation
                this.processedImageData = processedImageData;
                
                // Update the cell data with processed image
                if (this.currentCellKey) {
                    this.matrixData[this.currentCellKey] = {
                        ...this.matrixData[this.currentCellKey],
                        processedImageData: processedImageData
                    };
                    this.saveData();
                }
                
                this.showStatus('image-status', '✅ Image adjustments saved!', 'success');
                this.toggleImageEditor();
            };
            
            sourceImage.src = this.currentImageData;
            
        } catch (error) {
            console.error('Error saving image edits:', error);
            this.showStatus('image-status', '❌ Failed to save image edits', 'error');
        }
    }

    /**
     * Get the final image data for video generation (processed if available, otherwise original)
     */
    getFinalImageForVideo() {
        // Return processed image if available, otherwise return current image
        return this.processedImageData || this.currentImageData || null;
    }

    /**
     * Do everything - generate prompt, image, and video in sequence
     */
    async doEverything() {
        const doEverythingBtn = document.getElementById('do-everything-btn');
        const originalText = doEverythingBtn.textContent;
        
        try {
            // Disable the button and show progress
            doEverythingBtn.disabled = true;
            doEverythingBtn.textContent = 'Working...';
            
            // Step 1: Generate prompt
            this.switchToStep(1);
            doEverythingBtn.textContent = '🤖 Generating Prompt...';
            await this.modalGeneratePrompt();
            
            // Wait a moment for UI updates
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Step 2: Generate image (if prompt was successful)
            const cellData = this.matrixData[this.currentCellKey];
            if (cellData && cellData.prompt) {
                this.switchToStep(2);
                doEverythingBtn.textContent = '🎨 Generating Image...';
                await this.modalGenerateImage();
                
                // Wait a moment for UI updates
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Step 3: Generate video (if image was successful)
                const updatedCellData = this.matrixData[this.currentCellKey];
                if (updatedCellData && updatedCellData.imageUrl) {
                    this.switchToStep(3);
                    doEverythingBtn.textContent = '🎬 Generating Video...';
                    await this.modalGenerateVideo();
                }
            }
            
            // Success message
            this.showStatus('prompt-status', '🎉 Workflow completed successfully!', 'success');
            
        } catch (error) {
            console.error('Do everything workflow failed:', error);
            this.showStatus('prompt-status', '❌ Workflow failed', 'error');
        } finally {
            // Re-enable button
            doEverythingBtn.disabled = false;
            doEverythingBtn.textContent = originalText;
        }
    }



    /**
     * Download video file
     */
    downloadVideo(videoUrl) {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `omni-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Update video pricing display
     */
    updateVideoPricing() {
        const videoModel = document.getElementById('video-model-select')?.value || 'seedanceLite';
        const videoDuration = parseInt(document.getElementById('video-duration-select')?.value || 5);
        const costDisplay = document.getElementById('video-cost-display');
        
        if (costDisplay) {
            const cost = this.pricing.calculateVideoCost(1, videoModel, videoDuration);
            costDisplay.textContent = this.pricing.formatCost(cost);
        }
    }

    /**
     * Show pricing confirmation modal
     */
    async showPricingConfirmation(operationTitle, items) {
        return new Promise((resolve) => {
            // Create modal HTML
            const modalHTML = `
                <div class="pricing-modal" id="pricing-modal">
                    <div class="pricing-modal-content">
                        <div class="pricing-modal-header">
                            <h3 class="pricing-modal-title">${operationTitle}</h3>
                            <p class="pricing-modal-subtitle">Review the estimated costs for this operation</p>
                        </div>
                        
                        <div class="pricing-breakdown">
                            ${items.map(item => `
                                <div class="pricing-item">
                                    <div class="pricing-item-info">
                                        <div class="pricing-item-title">${item.title}</div>
                                        <div class="pricing-item-description">${item.description}</div>
                                    </div>
                                    <div class="pricing-item-cost">${this.pricing.formatCost(item.cost)}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="pricing-total">
                            <div class="pricing-total-label">Total Estimated Cost:</div>
                            <div class="pricing-total-amount">${this.pricing.formatCost(items.reduce((sum, item) => sum + item.cost, 0))}</div>
                        </div>
                        
                        <div class="pricing-modal-actions">
                            <button class="btn btn-cancel" id="pricing-cancel">Cancel</button>
                            <button class="btn btn-confirm" id="pricing-confirm">Confirm & Generate</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            const modal = document.getElementById('pricing-modal');
            const cancelBtn = document.getElementById('pricing-cancel');
            const confirmBtn = document.getElementById('pricing-confirm');
            
            const cleanup = () => {
                if (modal) {
                    modal.remove();
                }
            };
            
            // Event listeners
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
            
            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            });
            
            // Close on Escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    document.removeEventListener('keydown', escapeHandler);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
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
            // Row dot - use product name
            const stepClass = step === 1 ? 'prompt' : step === 2 ? 'image' : 'video';
            const dot = document.querySelector(`.matrix-row-dots[data-product="${productName}"] .row-dot.${stepClass}`);
            if (dot) {
                dot.classList.add('processing');
            }
        } else {
            // Column dot - use CNAE name
            const stepClass = step === 1 ? 'prompt' : step === 2 ? 'image' : 'video';
            const dot = document.querySelector(`.matrix-col-dots[data-cnae="${cnaeName}"] .col-dot.${stepClass}`);
            if (dot) {
                dot.classList.add('processing');
            }
        }
    }

    /**
     * Mark step button as completed
     */
    markStepButtonCompleted(productName, cnaeName, step, isRow = true) {
        if (isRow) {
            // Row dot - use product name
            const stepClass = step === 1 ? 'prompt' : step === 2 ? 'image' : 'video';
            const dot = document.querySelector(`.matrix-row-dots[data-product="${productName}"] .row-dot.${stepClass}`);
            if (dot) {
                dot.classList.remove('processing');
                dot.classList.add('completed');
            }
        } else {
            // Column dot - use CNAE name
            const stepClass = step === 1 ? 'prompt' : step === 2 ? 'image' : 'video';
            const dot = document.querySelector(`.matrix-col-dots[data-cnae="${cnaeName}"] .col-dot.${stepClass}`);
            if (dot) {
                dot.classList.remove('processing');
                dot.classList.add('completed');
            }
        }
    }

    /**
     * Generate column step (1=prompts, 2=images, 3=videos)
     */
    async generateColumnStep(cnaeName, step) {
        const cnaeProducts = this.products.filter(p => p.name); // Get all products
        
        // Calculate what needs to be generated and show pricing
        let pricingItems = [];
        let operationName = '';
        let tasksToRun = [];
        
        if (step === 1) {
            // Count prompts needed
            const promptsNeeded = cnaeProducts.filter(product => {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                return !cellData || !cellData.prompt;
            }).length;
            
            if (promptsNeeded === 0) {
                this.showMessage('All prompts already generated for this column!', 'success');
                return;
            }
            
            operationName = `Generate ${promptsNeeded} Prompts: ${cnaeName}`;
            pricingItems.push({
                title: 'Prompt Generation',
                description: `${promptsNeeded} prompts (~800 tokens each)`,
                cost: this.pricing.calculatePromptCost() * promptsNeeded
            });
            
        } else if (step === 2) {
            // Count images needed
            const imagesNeeded = cnaeProducts.filter(product => {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                return cellData && cellData.prompt && !cellData.imageUrl;
            }).length;
            
            if (imagesNeeded === 0) {
                this.showMessage('All images already generated for this column!', 'success');
                return;
            }
            
            operationName = `Generate ${imagesNeeded} Images: ${cnaeName}`;
            pricingItems.push({
                title: 'Image Generation',
                description: `${imagesNeeded} images (SeedDream 1000x1000)`,
                cost: this.pricing.calculateImageCost(imagesNeeded)
            });
            
        } else if (step === 3) {
            // Count videos needed
            const videosNeeded = cnaeProducts.filter(product => {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                return cellData && cellData.imageUrl && !cellData.videoUrl;
            }).length;
            
            if (videosNeeded === 0) {
                this.showMessage('All videos already generated for this column!', 'success');
                return;
            }
            
            operationName = `Generate ${videosNeeded} Videos: ${cnaeName}`;
            pricingItems.push({
                title: 'Video Generation',
                description: `${videosNeeded} videos (${this.pricing.getVideoModelName(this.pricing.videoSettings.model)}, ${this.pricing.videoSettings.duration}s each)`,
                cost: this.pricing.calculateVideoCost(videosNeeded)
            });
        }
        
        // Show pricing confirmation
        const confirmed = await this.showPricingConfirmation(operationName, pricingItems);
        if (!confirmed) return;
        
        // Mark button as processing
        this.markStepButtonProcessing(null, cnaeName, step, false);
        
        if (step === 1) {
            // Generate all prompts for column IN PARALLEL
            const promises = cnaeProducts.map(async (product) => {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                if (cellData && cellData.prompt) return { success: true, cellKey, skipped: true };
                
                try {
                    await this.generatePromptForCell(cellKey);
                    return { success: true, cellKey };
                } catch (error) {
                    console.error(`Failed to generate prompt for ${cellKey}:`, error);
                    return { success: false, cellKey, error };
                }
            });
            
            const results = await Promise.all(promises);
            const completed = results.filter(r => r.success && !r.skipped).length;
            this.showMessage(`Generated ${completed}/${cnaeProducts.length} prompts for ${cnaeName} (parallel)`, 'success');
            
            // Mark column step 1 as completed
            this.markStepButtonCompleted(null, cnaeName, 1, false);
            
        } else if (step === 2) {
            // Generate all images for column in parallel (only for cells with prompts)
            const imageTasks = [];
            for (const product of cnaeProducts) {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                if (cellData && cellData.prompt && !cellData.imageUrl) {
                    imageTasks.push(this.generateImageFromPrompt(cellKey));
                }
            }
            
            this.showMessage(`Generating ${imageTasks.length} images for ${cnaeName} in parallel...`, 'info');
            const results = await Promise.allSettled(imageTasks);
            const completed = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;
            
            if (failed > 0) {
                this.showMessage(`Generated ${completed} images for ${cnaeName} (${failed} failed)`, 'warning');
            } else {
                this.showMessage(`Generated ${completed} images for ${cnaeName}`, 'success');
            }
            
            // Mark column step 2 as completed
            this.markStepButtonCompleted(null, cnaeName, 2, false);
            
        } else if (step === 3) {
            // Generate all videos for column in parallel (only for cells with images)
            const videoTasks = [];
            for (const product of this.products) {
                const cellKey = `${product.name}-${cnaeName}`;
                const cellData = this.matrixData[cellKey];
                if (cellData && cellData.imageUrl && !cellData.videoUrl) {
                    videoTasks.push(this.generateVideoFromImageAndPrompt(cellKey));
                }
            }
            
            this.showMessage(`Generating ${videoTasks.length} videos for ${cnaeName} in parallel...`, 'info');
            const results = await Promise.allSettled(videoTasks);
            const completed = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;
            
            if (failed > 0) {
                this.showMessage(`Generated ${completed} videos for ${cnaeName} (${failed} failed)`, 'warning');
            } else {
                this.showMessage(`Generated ${completed} videos for ${cnaeName}`, 'success');
            }
            
            // Mark column step 3 as completed
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
            // Generate all images for row in parallel (only for cells with prompts)
            const imageTasks = [];
            for (const cnae of this.cnaes) {
                const cellKey = `${productName}-${cnae.name}`;
                const cellData = this.matrixData[cellKey];
                if (cellData && cellData.prompt && cellData.status === 'prompt_ready') {
                    imageTasks.push(this.generateImageFromPrompt(cellKey));
                }
            }
            
            this.showMessage(`Generating ${imageTasks.length} images for ${productName} in parallel...`, 'info');
            const results = await Promise.allSettled(imageTasks);
            const completed = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;
            
            if (failed > 0) {
                this.showMessage(`Generated ${completed} images for ${productName} (${failed} failed)`, 'warning');
            } else {
                this.showMessage(`Generated ${completed} images for ${productName}`, 'success');
            }
            
            // Mark row step 2 as completed
            this.markStepButtonCompleted(productName, null, 2, true);
            
        } else if (step === 3) {
            // Generate all videos for row in parallel (only for cells with images)
            const videoTasks = [];
            for (const cnae of this.cnaes) {
                const cellKey = `${productName}-${cnae.name}`;
                const cellData = this.matrixData[cellKey];
                if (cellData && cellData.imageUrl && cellData.status === 'generated') {
                    videoTasks.push(this.generateVideoFromImageAndPrompt(cellKey));
                }
            }
            
            this.showMessage(`Generating ${videoTasks.length} videos for ${productName} in parallel...`, 'info');
            const results = await Promise.allSettled(videoTasks);
            const completed = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;
            
            if (failed > 0) {
                this.showMessage(`Generated ${completed} videos for ${productName} (${failed} failed)`, 'warning');
            } else {
                this.showMessage(`Generated ${completed} videos for ${productName}`, 'success');
            }
            
            // Mark row step 3 as completed
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
     * Get clothing color based on percentage distribution
     */
    getClothingColorByDistribution(seed) {
        // Use seed to generate consistent random number
        const random = (seed * 9973) % 100; // Use prime number for distribution
        
        if (random < 40) {
            // 40% earth tones
            const earthTones = this.brazilianCharacteristics.clothingColors.earthTones;
            return earthTones[seed % earthTones.length];
        } else if (random < 60) {
            // 20% white
            const white = this.brazilianCharacteristics.clothingColors.white;
            return white[seed % white.length];
        } else if (random < 80) {
            // 20% black
            const black = this.brazilianCharacteristics.clothingColors.black;
            return black[seed % black.length];
        } else if (random < 90) {
            // 10% lime/avocado green
            const limeAvocado = this.brazilianCharacteristics.clothingColors.limeAvocado;
            return limeAvocado[seed % limeAvocado.length];
        } else {
            // 10% soft violet/light purple
            const softViolet = this.brazilianCharacteristics.clothingColors.softViolet;
            return softViolet[seed % softViolet.length];
        }
    }

    /**
     * Generate random age within 30-50 range
     */
    getRandomAge(seed) {
        const { min, max } = this.brazilianCharacteristics.ageRange;
        return min + (seed % (max - min + 1));
    }

    /**
     * Get characteristics based on seed - Brazilian enhanced version
     */
    getSeededCharacteristics(seed) {
        // Generate consistent characteristics based on seed
        const cities = this.brazilianCharacteristics.cities;
        const timesOfDay = this.brazilianCharacteristics.timesOfDay;
        const ethnicities = this.brazilianCharacteristics.ethnicities;
        
        const city = cities[seed % cities.length];
        const timeOfDay = timesOfDay[(seed * 7) % timesOfDay.length];
        const ethnicity = ethnicities[(seed * 13) % ethnicities.length];
        const clothingColor = this.getClothingColorByDistribution(seed);
        const age = this.getRandomAge(seed);
        
        return {
            city,
            timeOfDay,
            ethnicity,
            clothingColor,
            age
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
     * Get profession description from CNAE name - Brazilian version
     */
    getProfessionFromCnae(cnaeName) {
        const professionMap = {
            'Restaurante': 'garçom ou cozinheiro',
            'Padaria': 'padeiro ou atendente de padaria',
            'Farmácia': 'farmacêutico',
            'Loja de Roupa': 'vendedor de roupas',
            'Salão de Beleza': 'cabeleireiro ou esteticista',
            'Barbearia': 'barbeiro',
            'Oficina Mecânica': 'mecânico',
            'Clínicas / Odonto / Estética': 'profissional da saúde',
            'Mercadinho': 'atendente de mercado',
            'Açougue': 'açougueiro',
            'Tatuagem': 'tatuador',
            'Loja de Eletrônicos': 'vendedor de eletrônicos'
        };
        return professionMap[cnaeName] || 'profissional';
    }

    /**
     * Create Portuguese LLM instructions for profession-aware prompt generation
     */
    createPortugueseLLMInstructions() {
        const globalStyle = this.promptBuilder.getGlobalStylePrompt();
        return `Você é um especialista em criação de prompts para geração de imagens realistas de profissionais brasileiros em seus ambientes de trabalho.

INSTRUÇÕES PRINCIPAIS:
1. Crie prompts cinematográficos em português para imagens ultra-realistas
2. Use SEMPRE as características brasileiras fornecidas (etnia, cidade, horário, idade)
3. Adapte o ambiente e vestimenta à profissão específica
4. Para profissões como médicos, dentistas, farmacêuticos: IGNORE a cor da roupa sugerida e use uniformes profissionais apropriados (jaleco branco, scrubs, etc.). Use a cor sugerida apenas como cor de destaque no ambiente ou acessórios
5. Para outras profissões: use a cor da roupa sugerida normalmente
6. NUNCA inclua textos, letreiros, placas ou escritas visíveis na imagem
7. Use ambiente brasileiro apropriado para a profissão na cidade especificada
8. Inclua sempre a idade da pessoa (entre os valores fornecidos)
9. SEMPRE termine o prompt com as configurações técnicas globais fornecidas

CONFIGURAÇÕES TÉCNICAS GLOBAIS:
${globalStyle}

FORMATO DE RESPOSTA:
Retorne apenas o prompt final em português, incluindo as características + ambiente + configurações técnicas globais.

EXEMPLO PARA MÉDICO:
Entrada: "Profissão: Médico, Etnia: parda pele morena, Cidade: São Paulo, Horário: meio-dia, Idade: 35, Cor: roupa azul"
Saída: "Médico brasileiro de 35 anos, parda pele morena, usando jaleco branco, em consultório médico moderno em São Paulo, meio-dia com luz natural, ambiente com detalhes em tons de azul, equipamentos médicos, profissional e confiante. ${globalStyle}"

EXEMPLO PARA OUTRAS PROFISSÕES:
Entrada: "Profissão: Vendedor, Etnia: negra pele escura, Cidade: Salvador, Horário: entardecer, Idade: 42, Cor: roupa verde lima"
Saída: "Vendedor brasileiro de 42 anos, negra pele escura, vestindo roupa verde lima suave, em loja comercial em Salvador, luz do entardecer, ambiente profissional brasileiro, sorrindo e atendendo cliente. ${globalStyle}"`;
    }

    /**
     * Generate final prompt using Portuguese LLM system
     */
    async generateFinalPrompt(productName, basePrompt, cnae) {
        console.log('🎯 generateFinalPrompt called with:', { productName, basePrompt, cnae: cnae.name });
        
        // Get characteristics for this product
        const seed = this.getProductSeed(productName);
        const characteristics = this.getSeededCharacteristics(seed);
        
        console.log('📊 Generated characteristics:', characteristics);
        
        // Check if we have the required API keys
        if (!this.hasRequiredKeys()) {
            console.warn('❌ API keys not configured, falling back to Portuguese concatenation');
            return this.createFallbackPortuguesePrompt(basePrompt, cnae, characteristics);
        }
        
        try {
            console.log('🤖 Attempting Portuguese LLM prompt generation...');
            
            // Check if AuthManager and method are available
            if (!window.AuthManager) {
                throw new Error('AuthManager not available on window object');
            }
            
            if (typeof window.AuthManager.generatePromptWithInstructions !== 'function') {
                throw new Error(`generatePromptWithInstructions method not found on AuthManager`);
            }
            
            // Create Portuguese input for LLM
            const portugueseInput = `Prompt Base: "${basePrompt}"
Profissão: ${cnae.name}
Etnia: ${characteristics.ethnicity}
Cidade: ${characteristics.city}
Horário: ${characteristics.timeOfDay}
Idade: ${characteristics.age}
Cor Sugerida: ${characteristics.clothingColor}`;

            console.log('🔍 Sending Portuguese input to LLM:', portugueseInput);

            const finalPrompt = await window.AuthManager.generatePromptWithInstructions(
                this.createPortugueseLLMInstructions(), 
                portugueseInput
            );
            console.log('✅ Portuguese LLM prompt generation successful:', finalPrompt);
            return finalPrompt;
        } catch (error) {
            console.error('❌ Portuguese LLM prompt generation failed, falling back:', error);
            // Show error to user
            this.showMessage(`Geração de prompt falhou: ${error.message}. Usando fallback.`, 'warning');
            
            // Fallback to Portuguese approach if LLM fails
            return this.createFallbackPortuguesePrompt(basePrompt, cnae, characteristics);
        }
    }

    /**
     * Create fallback Portuguese prompt when LLM is not available
     */
    createFallbackPortuguesePrompt(basePrompt, cnae, characteristics) {
        // Professional clothing logic for fallback - expanded list
        const isProfessionalUniform = ['Clínicas / Odonto / Estética', 'Farmácia', 'Padaria'].some(prof => 
            cnae.name.toLowerCase().includes(prof.toLowerCase())
        );
        
        const clothingDescription = isProfessionalUniform 
            ? 'jaleco branco profissional'
            : characteristics.clothingColor;
            
        // Include global style settings
        const globalStyle = this.promptBuilder.getGlobalStylePrompt();
        
        const fallbackPrompt = `${basePrompt}. Pessoa brasileira de ${characteristics.age} anos, ${characteristics.ethnicity}, usando ${clothingDescription}, em ${cnae.name} em ${characteristics.city}, ${characteristics.timeOfDay}, ambiente brasileiro profissional, sem textos ou letreiros visíveis. ${globalStyle}`;
        
        console.log('🔄 Using Portuguese fallback prompt with global style:', fallbackPrompt);
        return fallbackPrompt;
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
                console.log('🎬 Updated global camera/style settings:', newStylePrompt.substring(0, 100) + '...');
                this.showMessage('Configurações de câmera e estilo salvos com sucesso', 'success');
            } else {
                this.showMessage('As configurações de estilo não podem estar vazias', 'error');
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
        console.log('🔄 Reset to default Brazilian camera settings');
        this.showMessage('Configurações resetadas para padrão brasileiro', 'success');
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
        
        // Check for text overflow after updating
        setTimeout(() => this.checkTextOverflow(), 10);
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
     * Setup phone preview panel functionality
     */
    setupPhonePanel() {
        const phoneToggle = document.getElementById('phone-toggle');
        const closePhonePanel = document.getElementById('close-phone-panel');
        const phonePanel = document.getElementById('phone-preview-panel');
        
        // Phone toggle functionality
        if (phoneToggle) {
            phoneToggle.addEventListener('click', () => {
                this.togglePhonePanel();
            });
        }
        
        // Close button functionality
        if (closePhonePanel) {
            closePhonePanel.addEventListener('click', () => {
                this.closePhonePanel();
            });
        }
        
        // Close phone panel when clicking outside
        document.addEventListener('click', (e) => {
            if (phonePanel && phonePanel.classList.contains('open')) {
                if (!phonePanel.contains(e.target) && !phoneToggle.contains(e.target)) {
                    this.closePhonePanel();
                }
            }
        });
        
        // Handle ESC key to close phone panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && phonePanel && phonePanel.classList.contains('open')) {
                this.closePhonePanel();
            }
        });
    }

    /**
     * Setup phone carousel navigation
     */
    setupPhoneCarousel() {
        const videoOverlay = document.getElementById('videoOverlay');
        const phoneMockup = document.querySelector('.phone-mockup');
        
        if (videoOverlay) {
            // Click to advance carousel
            videoOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        // Add arrow navigation around phone
        if (phoneMockup) {
            // Create left arrow
            const leftArrow = document.createElement('button');
            leftArrow.className = 'phone-nav-arrow phone-nav-left';
            leftArrow.innerHTML = '‹';
            leftArrow.addEventListener('click', () => this.previousSlide());
            
            // Create right arrow
            const rightArrow = document.createElement('button');
            rightArrow.className = 'phone-nav-arrow phone-nav-right';
            rightArrow.innerHTML = '›';
            rightArrow.addEventListener('click', () => this.nextSlide());
            
            // Add arrows to phone container
            phoneMockup.appendChild(leftArrow);
            phoneMockup.appendChild(rightArrow);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const phonePanel = document.getElementById('phone-preview-panel');
            if (phonePanel && phonePanel.classList.contains('open')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousSlide();
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            }
        });
    }

    /**
     * Initialize demo preview with first available CNAE
     */
    initializeDemoPreview() {
        // Wait a bit for data to load, then initialize
        setTimeout(() => {
            if (this.cnaes.length > 0) {
                const firstCnae = this.cnaes[0];
                const select = document.getElementById('demo-cnae-select');
                if (select) {
                    select.value = firstCnae.name;
                    this.loadDemoCarousel(firstCnae.name);
                }
            }
        }, 100);
    }

    /**
     * Development helper: Populate matrix with 1280x720 placeholder images
     * Call this from browser console: app.populateTestImages()
     */
    populateTestImages() {
        let imageId = 1;
        
        this.products.forEach(product => {
            this.cnaes.forEach(cnae => {
                const cellKey = `${product.name}-${cnae.name}`;
                
                // Create test data with 1280x720 placeholder
                this.matrixData[cellKey] = {
                    status: 'generated',
                    imageUrl: `https://picsum.photos/1280/720?random=${imageId}`,
                    prompt: `Test prompt for ${product.name} in ${cnae.name}`,
                    product: product.name,
                    cnae: cnae.name,
                    generatedAt: new Date().toISOString()
                };
                
                imageId++;
            });
        });
        
        this.renderMatrix();
        this.saveData();
        this.showMessage('Test images (1280x720) populated for all cells', 'success');
        
        // Update carousel if demo is open
        const selectedCnae = document.getElementById('demo-cnae-select')?.value;
        if (selectedCnae) {
            this.loadDemoCarousel(selectedCnae);
        }
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
     * Toggle phone panel open/close
     */
    togglePhonePanel() {
        const phonePanel = document.getElementById('phone-preview-panel');
        const phoneToggle = document.getElementById('phone-toggle');
        
        if (phonePanel && phoneToggle) {
            const isOpen = phonePanel.classList.contains('open');
            
            if (isOpen) {
                this.closePhonePanel();
            } else {
                this.openPhonePanel();
            }
        }
    }
    
    /**
     * Open phone panel
     */
    openPhonePanel() {
        const phonePanel = document.getElementById('phone-preview-panel');
        const phoneToggle = document.getElementById('phone-toggle');
        
        if (phonePanel && phoneToggle) {
            phonePanel.classList.remove('collapsed');
            phonePanel.classList.add('open');
            phoneToggle.classList.add('active');
        }
        
        // Start carousel timer when panel is opened
        this.startCarouselTimer();
    }
    
    /**
     * Close phone panel
     */
    closePhonePanel() {
        const phonePanel = document.getElementById('phone-preview-panel');
        const phoneToggle = document.getElementById('phone-toggle');
        
        if (phonePanel && phoneToggle) {
            phonePanel.classList.remove('open');
            phonePanel.classList.add('collapsed');
            phoneToggle.classList.remove('active');
        }
        
        // Stop carousel timer when panel is closed
        this.stopCarouselTimer();
    }

    /**
     * Setup prompts toggle button functionality
     */
    setupPromptsButton() {
        console.log('Setting up prompts button...');
        const promptsToggle = document.getElementById('prompts-toggle');
        
        if (promptsToggle) {
            promptsToggle.addEventListener('click', () => {
                this.togglePromptColumn();
                // Update button active state
                const leftFrame = document.querySelector('.matrix-left-frame');
                if (leftFrame && leftFrame.classList.contains('collapsed')) {
                    promptsToggle.classList.remove('active');
                } else {
                    promptsToggle.classList.add('active');
                }
            });
            console.log('✅ Prompts button setup completed');
        } else {
            console.warn('❌ Prompts button not found');
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
                const cnaeName = cnaeHeader.querySelector('h3').textContent.trim();
                const controls = cnaeHeader.querySelector(`[data-controls="${cnaeName}"]`);
                
                if (controls) {
                    isHolding = false;
                    holdTimer = setTimeout(() => {
                        isHolding = true;
                        controls.classList.remove('hidden');
                        cnaeHeader.classList.add('showing-controls');
                    }, 500); // 500ms hold time
                }
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

                // Hide CNAE controls
                const cnaeHeaders = document.querySelectorAll('.cnae-header-card');
                cnaeHeaders.forEach(header => {
                    const controls = header.querySelector('[data-controls]');
                    if (controls) {
                        controls.classList.add('hidden');
                        header.classList.remove('showing-controls');
                    }
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
                const cnaeName = cnaeHeader.querySelector('h3').textContent.trim();
                const controls = cnaeHeader.querySelector(`[data-controls="${cnaeName}"]`);
                
                if (controls) {
                    isHolding = false;
                    holdTimer = setTimeout(() => {
                        isHolding = true;
                        controls.classList.remove('hidden');
                        cnaeHeader.classList.add('showing-controls');
                    }, 500);
                }
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

                // Hide CNAE controls
                const cnaeHeaders = document.querySelectorAll('.cnae-header-card');
                cnaeHeaders.forEach(header => {
                    const controls = header.querySelector('[data-controls]');
                    if (controls) {
                        controls.classList.add('hidden');
                        header.classList.remove('showing-controls');
                    }
                });
            }
        });

        // Auto-hide on mouse leave with delegation
        document.addEventListener('mouseleave', (e) => {
            // Safety check: ensure target is a DOM element
            if (!e.target || typeof e.target.matches !== 'function') {
                return;
            }

            // Check if leaving a product header
            if (e.target.matches('.product-header') || e.target.closest('.product-header')) {
                const productHeader = e.target.matches('.product-header') ? e.target : e.target.closest('.product-header');
                if (productHeader && productHeader.classList.contains('showing-controls')) {
                    const controls = productHeader.querySelector('[data-controls]');
                    if (controls) {
                        // Add small delay to prevent flickering
                        setTimeout(() => {
                            if (!productHeader.matches(':hover')) {
                                controls.classList.add('hidden');
                                productHeader.classList.remove('showing-controls');
                            }
                        }, 100);
                    }
                }
            }

            // Check if leaving a CNAE header
            if (e.target.matches('.cnae-header-card') || e.target.closest('.cnae-header-card')) {
                const cnaeHeader = e.target.matches('.cnae-header-card') ? e.target : e.target.closest('.cnae-header-card');
                if (cnaeHeader && cnaeHeader.classList.contains('showing-controls')) {
                    const controls = cnaeHeader.querySelector('[data-controls]');
                    if (controls) {
                        // Add small delay to prevent flickering
                        setTimeout(() => {
                            if (!cnaeHeader.matches(':hover')) {
                                controls.classList.add('hidden');
                                cnaeHeader.classList.remove('showing-controls');
                            }
                        }, 100);
                    }
                }
            }
        }, true); // Use capture phase
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
        
        // Clean up product seeds
        delete this.productSeeds[name];
        
        this.renderMatrix();
        this.saveData();
        
        this.showMessage(`Removed product: ${name}`, 'success');
    }



    /**
     * Render matrix in card-style layout with fixed frames
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

        // Create fixed corner frame (top-left intersection) - collapsed by default
        const cornerFrame = document.createElement('div');
        cornerFrame.className = 'matrix-corner-frame collapsed';
        
        // Create fixed header frame - collapsed by default
        const headerFrame = document.createElement('div');
        headerFrame.className = 'matrix-header-frame collapsed';
        
        // Create fixed left frame - collapsed by default
        const leftFrame = document.createElement('div');
        leftFrame.className = 'matrix-left-frame collapsed';
        
        // Create scrollable content area - collapsed by default
        const contentArea = document.createElement('div');
        contentArea.className = 'matrix-content-area collapsed';
        
        // Create the main matrix container
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-container';

        // Corner content (spacers for dots, product and prompt columns)
        const cornerRow = document.createElement('div');
        cornerRow.className = 'matrix-header-row';
        cornerRow.style.height = '80px'; /* Match header height */
        
        // Add spacer for the new dots column
        const dotsSpacer = document.createElement('div');
        dotsSpacer.className = 'column-spacer dots-spacer';
        dotsSpacer.style.width = '50px';
        dotsSpacer.style.minWidth = '50px';
        cornerRow.appendChild(dotsSpacer);
        
        const productSpacer = document.createElement('div');
        productSpacer.className = 'column-spacer';
        cornerRow.appendChild(productSpacer);

        const promptSpacer = document.createElement('div');
        promptSpacer.className = 'column-spacer';
        promptSpacer.id = 'prompt-spacer';
        promptSpacer.style.display = 'none'; // Hidden by default since starting collapsed
        cornerRow.appendChild(promptSpacer);
        
        cornerFrame.appendChild(cornerRow);

        // Header row with dots above each column
        const headerRow = document.createElement('div');
        headerRow.className = 'matrix-header-row';
        // Height is handled by CSS

        // CNAE headers with column dots above each one
        this.cnaes.forEach((cnae, index) => {
            const cnaeHeader = document.createElement('div');
            cnaeHeader.className = 'cnae-header-card';
            cnaeHeader.innerHTML = `
                <div class="matrix-col-dots" data-cnae="${cnae.name}">
                    <div class="col-dot prompt" onclick="app.generateColumnStep('${cnae.name}', 1)" title="Generate all prompts for ${cnae.name}"></div>
                    <div class="col-dot image" onclick="app.generateColumnStep('${cnae.name}', 2)" title="Generate all images for ${cnae.name}"></div>
                    <div class="col-dot video" onclick="app.generateColumnStep('${cnae.name}', 3)" title="Generate all videos for ${cnae.name}"></div>
                </div>
                <h3>${cnae.name}</h3>
                <div class="cnae-controls hidden" data-controls="${cnae.name}">
                    <button class="delete-btn" onclick="app.removeCnae('${cnae.name}')" title="Remove">×</button>
                </div>
            `;
            headerRow.appendChild(cnaeHeader);
        });

        // Add header row to header frame
        headerFrame.appendChild(headerRow);

        // Create three separate full columns (much cleaner architecture)
        
        // Column 1: Single dots column containing all row dots
        const dotsColumn = document.createElement('div');
        dotsColumn.className = 'full-dots-column';
        this.products.forEach((product, productIndex) => {
            const dotRow = document.createElement('div');
            dotRow.className = 'dot-row-container';
            dotRow.innerHTML = `
                <div class="matrix-row-dots" data-product="${product.name}">
                    <div class="row-dot prompt" onclick="app.generateRowStep('${product.name}', 1)" title="Generate all prompts for ${product.name}"></div>
                    <div class="row-dot image" onclick="app.generateRowStep('${product.name}', 2)" title="Generate all images for ${product.name}"></div>
                    <div class="row-dot video" onclick="app.generateRowStep('${product.name}', 3)" title="Generate all videos for ${product.name}"></div>
                </div>
            `;
            dotsColumn.appendChild(dotRow);
        });
        leftFrame.appendChild(dotsColumn);

        // Column 2: Single products column containing all product headers
        const productsColumn = document.createElement('div');
        productsColumn.className = 'full-products-column';
        this.products.forEach((product, productIndex) => {
            const productRow = document.createElement('div');
            productRow.className = 'product-row-container';
            productRow.innerHTML = `
                <div class="product-header" data-product="${product.name}">
                    <div class="product-title-container">
                        <div class="product-name-display" onclick="app.makeProductNameEditable('${product.name}', this)">${product.name}</div>
                    </div>
                    <div class="product-controls hidden" data-controls="${product.name}">
                        <button class="delete-btn" onclick="app.removeProduct('${product.name}')" title="Remove">×</button>
                    </div>
                </div>
            `;
            productsColumn.appendChild(productRow);
        });
        leftFrame.appendChild(productsColumn);

        // Column 3: Single prompts column containing all prompt displays (this is what slides)
        const promptsColumn = document.createElement('div');
        promptsColumn.className = 'full-prompts-column';
        this.products.forEach((product, productIndex) => {
            const promptRow = document.createElement('div');
            promptRow.className = 'prompt-row-container';
            const seedInfo = this.getSeededCharacteristics(this.getProductSeed(product.name));
            promptRow.innerHTML = `
                <div class="prompt-display-container" data-product-index="${productIndex}">
                    <div class="prompt-display" onclick="app.makePromptEditable(${productIndex}, this)">${product.prompt || 'Professional top-view product shot on clean white background'}</div>
                    <textarea class="prompt-edit hidden" 
                              onblur="app.savePromptEdit(${productIndex}, this)"
                              onkeypress="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); this.blur(); }">${product.prompt || 'Professional top-view product shot on clean white background'}</textarea>
                </div>
                <div class="characteristics-display" onclick="event.stopPropagation(); app.shuffleProductCharacteristics('${product.name}')" title="Click to shuffle characteristics">${seedInfo.age} anos, ${seedInfo.ethnicity}, ${seedInfo.clothingColor}, ${seedInfo.timeOfDay}, ${seedInfo.city}</div>
            `;
            promptsColumn.appendChild(promptRow);
        });
        leftFrame.appendChild(promptsColumn);

        // Create content rows for CNAE results (using global row height)
        this.products.forEach((product, productIndex) => {
            const contentRow = document.createElement('div');
            contentRow.className = 'product-row-card';
            // Height is now handled entirely by CSS variables

            this.cnaes.forEach(cnae => {
                const cellKey = `${product.name}-${cnae.name}`;
                const cellData = this.matrixData[cellKey];
                
                const cnaeColumn = document.createElement('div');
                cnaeColumn.className = 'cnae-result-column';
                cnaeColumn.innerHTML = this.renderCnaeCell(cellKey, cellData, product, cnae);
                contentRow.appendChild(cnaeColumn);
            });

            contentArea.appendChild(contentRow);
        });

        // Assemble the complete layout
        container.appendChild(cornerFrame);
        container.appendChild(headerFrame);
        container.appendChild(leftFrame);
        container.appendChild(contentArea);
        
        // Add dedicated border elements that match content area height        
        const productsBorder = document.createElement('div');
        productsBorder.className = 'matrix-border-products';
        productsBorder.style.opacity = '0'; // Start hidden since starting collapsed
        container.appendChild(productsBorder);
        
        // Prompts border is now part of the actual prompts column

        // Add scroll synchronization
        this.setupScrollSync(headerFrame, contentArea, leftFrame);
        
        // Set body class for collapsed state by default
        document.body.classList.add('matrix-collapsed');
        
        // Setup prompts column border interaction
        setTimeout(() => {
            this.setupPromptsColumnBorder();
        }, 100);
        
        // Check for text overflow after rendering
        setTimeout(() => this.checkTextOverflow(), 50);
        
        console.log('✅ Matrix rendered with synced scroll layout');
    }

    /**
     * Setup scroll synchronization between frames
     */
    setupScrollSync(headerFrame, contentArea, leftFrame) {
        // Sync horizontal scrolling between header and content
        contentArea.addEventListener('scroll', () => {
            headerFrame.scrollLeft = contentArea.scrollLeft;
        });
        
        headerFrame.addEventListener('scroll', () => {
            contentArea.scrollLeft = headerFrame.scrollLeft;
        });
        
        // Sync vertical scrolling between left frame and content
        contentArea.addEventListener('scroll', () => {
            leftFrame.scrollTop = contentArea.scrollTop;
        });
        
        leftFrame.addEventListener('scroll', () => {
            contentArea.scrollTop = leftFrame.scrollTop;
        });
    }

    /**
     * Setup clickable border on the actual prompts column
     */
    setupPromptsColumnBorder() {
        const promptsColumn = document.querySelector('.full-prompts-column');
        const promptsToggle = document.getElementById('prompts-toggle');
        
        if (promptsColumn) {
            // Add click listener to the prompts column border
            promptsColumn.addEventListener('click', (e) => {
                // Only trigger if clicking on the right edge area
                const rect = promptsColumn.getBoundingClientRect();
                const clickX = e.clientX;
                const rightEdgeStart = rect.right - 15; // 15px clickable area from right edge
                
                if (clickX >= rightEdgeStart) {
                    console.log('Prompts column border clicked!');
                    this.togglePromptColumn();
                    
                    // Update button active state
                    const leftFrame = document.querySelector('.matrix-left-frame');
                    if (promptsToggle) {
                        if (leftFrame && leftFrame.classList.contains('collapsed')) {
                            promptsToggle.classList.remove('active');
                        } else {
                            promptsToggle.classList.add('active');
                        }
                    }
                }
            });
            
            console.log('✅ Prompts column border interaction setup completed');
        } else {
            console.warn('❌ Prompts column not found for border setup');
        }
    }

    /**
     * Toggle prompt column collapsed state
     */
    togglePromptColumn() {
        const leftFrame = document.querySelector('.matrix-left-frame');
        const headerFrame = document.querySelector('.matrix-header-frame');
        const contentArea = document.querySelector('.matrix-content-area');
        const cornerFrame = document.querySelector('.matrix-corner-frame');
        const promptSpacer = document.getElementById('prompt-spacer');
        const promptColumns = document.querySelectorAll('.prompt-column');
        const productsBorder = document.querySelector('.matrix-border-products');
        const promptsTab = document.querySelector('.prompts-tab');
        
        const isCollapsed = leftFrame.classList.contains('collapsed');
        
        console.log('Toggle state - Currently collapsed:', isCollapsed);
        
        if (isCollapsed) {
            // Expand
            console.log('Expanding prompts column...');
            leftFrame.classList.remove('collapsed');
            headerFrame.classList.remove('collapsed');
            contentArea.classList.remove('collapsed');
            cornerFrame.classList.remove('collapsed');
            document.body.classList.remove('matrix-collapsed');
            
            if (promptSpacer) promptSpacer.style.display = 'flex';
            
            // Fade border back in when expanded
            if (productsBorder) {
                productsBorder.style.opacity = '1';
            }
            
            promptColumns.forEach(col => {
                col.classList.remove('collapsed');
            });
        } else {
            // Collapse
            console.log('Collapsing prompts column...');
            leftFrame.classList.add('collapsed');
            headerFrame.classList.add('collapsed');
            contentArea.classList.add('collapsed');
            cornerFrame.classList.add('collapsed');
            document.body.classList.add('matrix-collapsed');
            
            if (promptSpacer) promptSpacer.style.display = 'none';
            
            // Fade border out when collapsed
            if (productsBorder) {
                productsBorder.style.opacity = '0';
            }
            
            promptColumns.forEach(col => {
                col.classList.add('collapsed');
            });
        }
        
        console.log('Toggle completed - New state collapsed:', leftFrame.classList.contains('collapsed'));
    }



    /**
     * Render CNAE cell for card layout
     */
    renderCnaeCell(cellKey, cellData, product, cnae) {
        let statusClass = 'cell-empty';
        let content = 'Ready to generate';
        
        if (cellData) {
            // Check for image first (regardless of status) - this fixes the bug
            if (cellData.imageUrl) {
                statusClass = 'cell-generated';
                content = `<img src="${cellData.imageUrl}" alt="${product.name} - ${cnae.name}" class="cell-image">`;
            } else if (cellData.status === 'generating') {
                statusClass = 'cell-generating';
                if (cellData.loadingGif) {
                    content = `
                        <div style="display: flex; justify-content: center; align-items: center; height: 100%; background: #161518;">
                            <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="max-height: 100%; width: auto; object-fit: contain;">
                        </div>
                    `;
                } else {
                    content = 'Generating...';
                }
            } else if (cellData.status === 'prompt_ready' || cellData.prompt) {
                statusClass = 'cell-prompt-ready';
                content = 'Prompt ready';
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
        this.startCarouselTimer();
    }

    /**
     * Start auto-switching timer for carousel
     */
    startCarouselTimer() {
        this.stopCarouselTimer();
        if (this.carouselData.length > 1) {
            this.carouselTimer = setInterval(() => {
                this.nextSlide('auto');
            }, 10000); // 10 seconds
        }
    }

    /**
     * Stop auto-switching timer
     */
    stopCarouselTimer() {
        if (this.carouselTimer) {
            clearInterval(this.carouselTimer);
            this.carouselTimer = null;
        }
    }

    /**
     * Update carousel display
     */
    updateCarouselDisplay() {
        const videoPlaceholder = document.querySelector('.video-placeholder');
        const indicator = document.getElementById('slide-indicator');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        const cnaeTitle = document.getElementById('demo-cnae-title');

        if (this.carouselData.length === 0) {
            if (videoPlaceholder) {
                videoPlaceholder.innerHTML = '<span>Generated content will appear here</span>';
                videoPlaceholder.classList.remove('with-content');
            }
            if (indicator) indicator.textContent = '0/0';
            if (cnaeTitle) cnaeTitle.textContent = 'No products available';
            
            // Clear indicators
            if (indicatorsContainer) {
                indicatorsContainer.innerHTML = '<div class="indicator active"></div>';
            }
            this.stopCarouselTimer();
            return;
        }

        // Create dynamic indicators based on actual product count
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < this.carouselData.length; i++) {
                const indicator = document.createElement('div');
                indicator.className = `indicator ${i === this.currentSlide ? 'active' : ''}`;
                indicatorsContainer.appendChild(indicator);
            }
        }

        // Create or update sliding carousel container
        if (videoPlaceholder) {
            // Always re-initialize to ensure correct slide count and content
            this.initializeCarouselSlides(videoPlaceholder);
            videoPlaceholder.classList.add('with-content');
        }

        // Update title with current product name
        const currentItem = this.carouselData[this.currentSlide];
        if (cnaeTitle && currentItem) {
            cnaeTitle.textContent = currentItem.title;
        }

        // Update slide indicator
        if (indicator) {
            indicator.textContent = `${this.currentSlide + 1}/${this.carouselData.length}`;
        }
    }

    /**
     * Initialize carousel slides with sliding animation
     */
    initializeCarouselSlides(container) {
        // Clear container first
        container.innerHTML = '';
        
        if (this.carouselData.length === 0) {
            container.innerHTML = '<span>Generated content will appear here</span>';
            return;
        }

        // Create wrapper that will slide horizontally
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-slides-wrapper';
        
        // Calculate proper dimensions
        const slideCount = this.carouselData.length;
        const wrapperWidth = slideCount * 100; // 300% for 3 slides
        const slideWidth = 100 / slideCount; // 33.33% for 3 slides
        const translatePercent = this.currentSlide * slideWidth; // 0%, 33.33%, 66.66%
        
        wrapper.style.cssText = `
            width: ${wrapperWidth}%;
            height: 100%;
            display: flex;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(-${translatePercent}%);
            position: absolute;
            top: 0;
            left: 0;
        `;

        // Create each slide with exact container dimensions
        this.carouselData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide-container';
            slide.style.cssText = `
                width: ${slideWidth}%;
                height: 100%;
                flex-shrink: 0;
                position: relative;
                overflow: hidden;
            `;
            
            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.title;
            img.style.cssText = `
                width: auto;
                height: 100%;
                max-height: 100%;
                object-fit: cover;
                object-position: center;
                display: block;
                margin: 0 auto;
            `;
            
            slide.appendChild(img);
            wrapper.appendChild(slide);
        });

        container.appendChild(wrapper);
    }

    /**
     * Update carousel slides animation with correct math
     */
    updateCarouselSlides() {
        const wrapper = document.querySelector('.carousel-slides-wrapper');
        if (wrapper && this.carouselData.length > 0) {
            const slideWidth = 100 / this.carouselData.length;
            const translatePercent = this.currentSlide * slideWidth;
            wrapper.style.transform = `translateX(-${translatePercent}%)`;
        }
    }

    /**
     * Go to previous slide
     */
    previousSlide() {
        if (this.carouselData.length === 0) return;
        
        // Restart timer on manual navigation
        this.stopCarouselTimer();
        
        if (this.currentSlide > 0) {
            this.currentSlide--;
        } else {
            // Wrap to last slide
            this.currentSlide = this.carouselData.length - 1;
        }
        this.updateSlidePosition();
        this.startCarouselTimer();
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        if (this.carouselData.length === 0) return;
        
        // Restart timer on manual navigation (except for auto-advance)
        const wasAutoAdvance = arguments[0] === 'auto';
        if (!wasAutoAdvance) {
            this.stopCarouselTimer();
        }
        
        if (this.currentSlide < this.carouselData.length - 1) {
            this.currentSlide++;
        } else {
            // Wrap to first slide
            this.currentSlide = 0;
        }
        this.updateSlidePosition();
        
        if (!wasAutoAdvance) {
            this.startCarouselTimer();
        }
    }

    /**
     * Update slide position and indicators without full re-render
     */
    updateSlidePosition() {
        // Update slide transform
        this.updateCarouselSlides();
        
        // Update indicators
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        indicators.forEach((ind, index) => {
            ind.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update title
        const cnaeTitle = document.getElementById('demo-cnae-title');
        const currentItem = this.carouselData[this.currentSlide];
        if (cnaeTitle && currentItem) {
            cnaeTitle.textContent = currentItem.title;
        }
        
        // Update counter
        const indicator = document.getElementById('slide-indicator');
        if (indicator) {
            indicator.textContent = `${this.currentSlide + 1}/${this.carouselData.length}`;
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
     * Full purge - Clear all generated content but keep CNAEs and products configuration
     */
    fullPurgeGenerated() {
        const totalItems = Object.keys(this.matrixData).length;
        
        // Clear all generated content
        this.matrixData = {};
        this.carouselData = [];
        this.currentSlide = 0;
        this.stopCarouselTimer();

        // Re-render everything to show empty state
        this.renderMatrix();
        this.updateDemoSelector();
        this.updateCarouselDisplay();
        this.saveData();

        // Clear any stored API rate limits and generation history
        if (window.SecurityUtils && window.SecurityUtils.clearAllData) {
            // Only clear rate limits, not API keys
            const rateLimitKeys = Object.keys(localStorage).filter(key => key.startsWith('rate_'));
            rateLimitKeys.forEach(key => localStorage.removeItem(key));
        }

        this.showMessage(`🗑️ PURGE COMPLETO: ${totalItems} itens gerados foram removidos. CNAEs e produtos preservados.`, 'success');
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
        this.stopCarouselTimer();

        this.renderCnaeList();
        this.renderProductList();
        this.renderMatrix();
        this.updateDemoSelector();
        this.updateCarouselDisplay();
        this.saveData();

        this.showMessage('Todos os dados foram resetados para os padrões brasileiros', 'success');
    }

    /**
     * Reset only generated prompts (keep images and matrix structure)
     */
    resetAllPrompts() {
        let promptCount = 0;
        
        // Clear only prompt data, keep generated images
        Object.keys(this.matrixData).forEach(cellKey => {
            const cellData = this.matrixData[cellKey];
            if (cellData && cellData.prompt) {
                promptCount++;
                // Keep images but remove prompts and reset status
                if (cellData.imageUrl) {
                    // Keep the image but remove prompt
                    this.matrixData[cellKey] = {
                        status: 'generated',
                        imageUrl: cellData.imageUrl,
                        product: cellData.product,
                        cnae: cellData.cnae,
                        generatedAt: cellData.generatedAt
                    };
                } else {
                    // Remove prompt-only cells
                    delete this.matrixData[cellKey];
                }
            }
        });

        this.renderMatrix();
        this.saveData();
        this.showMessage(`${promptCount} prompts foram removidos (imagens preservadas)`, 'success');
    }

    /**
     * Reset only generated images (keep prompts)
     */
    resetAllImages() {
        let imageCount = 0;
        
        // Clear only image data, keep prompts
        Object.keys(this.matrixData).forEach(cellKey => {
            const cellData = this.matrixData[cellKey];
            if (cellData && cellData.imageUrl) {
                imageCount++;
                // Keep prompt but remove image
                if (cellData.prompt) {
                    this.matrixData[cellKey] = {
                        status: 'prompt_ready',
                        prompt: cellData.prompt,
                        product: cellData.product,
                        cnae: cellData.cnae,
                        generatedAt: cellData.generatedAt
                    };
                } else {
                    // Remove image-only cells
                    delete this.matrixData[cellKey];
                }
            }
        });

        this.renderMatrix();
        this.saveData();
        this.updateCarouselDisplay(); // Update carousel since images are gone
        this.showMessage(`${imageCount} imagens foram removidas (prompts preservados)`, 'success');
    }

    /**
     * Reset only products to defaults
     */
    resetProducts() {
        this.products = [...this.defaultProducts];
        
        // Clear matrix data related to removed products
        const currentProductNames = this.products.map(p => p.name);
        Object.keys(this.matrixData).forEach(cellKey => {
            const [productName] = cellKey.split('-');
            if (!currentProductNames.includes(productName)) {
                delete this.matrixData[cellKey];
            }
        });

        // Clear product seeds for old products
        const oldSeeds = {...this.productSeeds};
        this.productSeeds = {};
        currentProductNames.forEach(productName => {
            if (oldSeeds[productName]) {
                this.productSeeds[productName] = oldSeeds[productName];
            }
        });

        this.renderMatrix();
        this.saveData();
        this.showMessage(`Lista de produtos resetada para padrões fintech brasileiros (${this.products.length} produtos)`, 'success');
    }

    /**
     * Reset only CNAEs to defaults
     */
    resetCnaes() {
        this.cnaes = [...this.defaultCnaes];
        
        // Clear matrix data related to removed CNAEs
        const currentCnaeNames = this.cnaes.map(c => c.name);
        Object.keys(this.matrixData).forEach(cellKey => {
            const [, cnaeName] = cellKey.split('-');
            if (!currentCnaeNames.includes(cnaeName)) {
                delete this.matrixData[cellKey];
            }
        });

        this.renderMatrix();
        this.updateDemoSelector();
        this.saveData();
        this.showMessage(`Lista de CNAEs resetada para padrões brasileiros (${this.cnaes.length} CNAEs)`, 'success');
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

    /**
     * Check if text elements overflow and apply gradient fade effect
     */
    checkTextOverflow() {
        // Check prompt displays in matrix grid
        document.querySelectorAll('.prompt-display').forEach(element => {
            const isOverflowing = element.scrollHeight > element.clientHeight;
            element.classList.toggle('overflowing', isOverflowing);
        });

        // Check modal prompt editor
        const promptEditor = document.getElementById('prompt-editor');
        if (promptEditor) {
            const stepContent = promptEditor.closest('.step-content');
            if (stepContent) {
                const isOverflowing = promptEditor.scrollHeight > promptEditor.clientHeight;
                stepContent.classList.toggle('overflowing', isOverflowing);
            }
        }

        // Check global style prompt editor
        const styleEditor = document.getElementById('global-style-prompt');
        if (styleEditor) {
            const container = styleEditor.closest('.style-prompt-container');
            if (container) {
                const isOverflowing = styleEditor.scrollHeight > styleEditor.clientHeight;
                container.classList.toggle('overflowing', isOverflowing);
            }
        }
    }

    /**
     * Initialize overflow detection for text elements
     */
    setupOverflowDetection() {
        // Check overflow on page load
        setTimeout(() => this.checkTextOverflow(), 100);

        // Check overflow when text content changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('.prompt-display, #prompt-editor, #global-style-prompt')) {
                setTimeout(() => this.checkTextOverflow(), 10);
            }
        });

        // Check overflow on window resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.checkTextOverflow(), 150);
        });

        // Check overflow when modal is opened
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.id === 'cell-modal' && target.style.display !== 'none') {
                        setTimeout(() => this.checkTextOverflow(), 100);
                    }
                }
            });
        });

        const modal = document.getElementById('cell-modal');
        if (modal) {
            observer.observe(modal, { attributes: true });
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

/**
 * Pricing Calculator for AI Operations
 */
class PricingCalculator {
    constructor() {
        // Pricing rates (in USD)
        this.rates = {
            prompt: {
                inputTokens: 0.0015 / 1000,   // $0.0015 per 1K input tokens (GPT-4o-mini)
                outputTokens: 0.006 / 1000    // $0.006 per 1K output tokens (GPT-4o-mini)
            },
            image: {
                seedream: 0.03  // $0.03 per image
            },
            video: {
                seedanceLite: 0.036,   // $0.036 per second (SeedDance Lite)
                seedancePro: 0.06      // $0.06 per second (SeedDance Pro)
            }
        };
        
        // Default video settings
        this.videoSettings = {
            model: 'seedanceLite',    // 'seedanceLite' or 'seedancePro'
            duration: 5               // 5 or 10 seconds
        };
    }

    /**
     * Estimate prompt generation cost (input + output tokens)
     */
    calculatePromptCost(estimatedInputTokens = 500, estimatedOutputTokens = 300) {
        const inputCost = estimatedInputTokens * this.rates.prompt.inputTokens;
        const outputCost = estimatedOutputTokens * this.rates.prompt.outputTokens;
        return inputCost + outputCost;
    }

    /**
     * Calculate image generation cost
     */
    calculateImageCost(count = 1) {
        return count * this.rates.image.seedream;
    }

    /**
     * Calculate video generation cost
     */
    calculateVideoCost(count = 1, model = null, duration = null) {
        const videoModel = model || this.videoSettings.model;
        const videoDuration = duration || this.videoSettings.duration;
        const costPerSecond = this.rates.video[videoModel];
        return count * costPerSecond * videoDuration;
    }

    /**
     * Calculate total operation cost
     */
    calculateOperationCost(operation) {
        let cost = 0;
        
        if (operation.prompts > 0) {
            cost += this.calculatePromptCost() * operation.prompts;
        }
        
        if (operation.images > 0) {
            cost += this.calculateImageCost(operation.images);
        }
        
        if (operation.videos > 0) {
            cost += this.calculateVideoCost(operation.videos, operation.videoModel, operation.videoDuration);
        }
        
        return cost;
    }

    /**
     * Format cost for display
     */
    formatCost(cost) {
        if (cost < 0.01) {
            return `$${(cost * 100).toFixed(2)}¢`; // Show in cents for very small amounts
        }
        return `$${cost.toFixed(3)}`;
    }

    /**
     * Get video model display name
     */
    getVideoModelName(model) {
        const names = {
            seedanceLite: 'SeedDance Lite (720p)',
            seedancePro: 'SeedDance Pro (720p)'
        };
        return names[model] || model;
    }

    /**
     * Set video generation preferences
     */
    setVideoSettings(model, duration) {
        this.videoSettings.model = model;
        this.videoSettings.duration = duration;
    }

    /**
     * Get estimated costs for different operations
     */
    getOperationEstimate(operationType, count = 1) {
        switch (operationType) {
            case 'prompt':
                return {
                    cost: this.calculatePromptCost() * count,
                    description: `${count} prompt${count > 1 ? 's' : ''} (~800 tokens each)`
                };
            case 'image':
                return {
                    cost: this.calculateImageCost(count),
                    description: `${count} image${count > 1 ? 's' : ''} (SeedDream 1000x1000)`
                };
            case 'video':
                return {
                    cost: this.calculateVideoCost(count),
                    description: `${count} video${count > 1 ? 's' : ''} (${this.getVideoModelName(this.videoSettings.model)}, ${this.videoSettings.duration}s each)`
                };
        }
    }
}

// Add reset functionality to window for debugging
window.resetApp = () => app.resetAllData();
window.fullPurge = () => app.fullPurgeGenerated();
window.resetPrompts = () => app.resetAllPrompts();
window.resetImages = () => app.resetAllImages();
window.resetProducts = () => app.resetProducts();
window.resetCnaes = () => app.resetCnaes();

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
