const BRAND_GREEN = "#c1f732";
const BRAND_PURPLE = "#c87ef7";
const IS_LOCAL = (
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1' ||
  location.protocol === 'file:'
);
const IS_VERCEL = location.hostname.includes('vercel.app');
const IS_GITHUB_PAGES = location.hostname.includes('github.io');

// API endpoints - detect deployment platform
const API_BASE = IS_LOCAL ? 'http://localhost:8787' : '/api';

// For GitHub Pages, we'll use direct API calls
const GITHUB_PAGES_MODE = IS_GITHUB_PAGES || (!IS_LOCAL && !IS_VERCEL);

// API key management removed - authentication required

// Client-side API key management removed - authentication required

const CNAE_OPTIONS = [
  "1623-9/01 - Marcenaria",
  "1813-0/01 - Gráfica",
  "2391-5/01 - Marmoraria",
  "2511-0/00 - Serralheria",
  "4520-0/01 - Oficina Mecânica",
  "4520-0/03 - Oficina de Motos",
  "4520-0/04 - Borracharia",
  "4637-1/01 - Distribuidora de Doces",
  "4711-3/02 - Supermercado",
  "4721-1/02 - Padaria",
  "4722-9/01 - Açougue",
  "4724-5/00 - Frutaria",
  "4757-1/00 - Loja de Livros",
  "4759-8/01 - Loja de Móveis",
  "4763-6/03 - Loja de Esportes",
  "4771-7/01 - Farmácia",
  "4781-4/00 - Loja de Roupas",
  "4782-2/01 - Loja de Calçados",
  "4789-0/03 - Loja de Perfumes",
  "4789-0/04 - Ótica",
  "4789-0/06 - Joalheria",
  "4789-0/07 - Papelaria",
  "4789-0/08 - Pet Shop",
  "4789-0/09 - Loja de Informática",
  "4789-0/10 - Loja de Brinquedos",
  "4789-0/11 - Loja de Instrumentos",
  "4789-0/12 - Floricultura",
  "4789-0/13 - Loja de Celulares",
  "4789-0/14 - Loja de Bicicletas",
  "4789-0/15 - Loja de Artesanato",
  "4930-2/01 - Transportadora",
  "5110-2/00 - Taxi Aéreo",
  "5510-8/02 - Pousada",
  "5611-2/01 - Churrascaria",
  "5611-2/02 - Restaurante",
  "5611-2/03 - Pizzaria",
  "5611-2/04 - Sorveteria",
  "5611-2/05 - Confeitaria",
  "5611-2/07 - Restaurante Japonês",
  "5620-1/03 - Lanchonete",
  "5620-1/04 - Açaíteria",
  "5620-1/05 - Hamburgueria",
  "5620-1/06 - Tapiocaria",
  "5620-1/07 - Casa de Sucos",
  "6911-7/01 - Escritório de Advocacia",
  "7500-1/00 - Clínica Veterinária",
  "7722-2/00 - Locadora",
  "8511-2/00 - Escola Particular",
  "8511-2/01 - Creche",
  "8549-2/00 - Autoescola",
  "8592-9/01 - Escola de Dança",
  "8593-7/00 - Escola de Idiomas",
  "8630-5/01 - Odontologia",
  "8630-5/03 - Fisioterapia",
  "8630-5/04 - Psicologia",
  "8630-5/05 - Laboratório",
  "8630-5/06 - Nutrição",
  "8630-5/07 - Acupuntura",
  "9319-1/01 - Studio de Pilates",
  "9319-1/99 - Crossfit",
  "9329-8/01 - Academia de Ginástica",
  "9511-8/00 - Assistência Técnica",
  "9601-7/01 - Lavanderia",
  "9602-5/01 - Salão de Beleza",
  "9602-5/02 - Barbearia",
  "9602-5/04 - Estética e Cosméticos",
  "9609-2/06 - Studio de Tatuagem"
];

const REGIONS = {
  "Sudeste": ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "Niterói", "Juiz de Fora", "Uberlândia", "Contagem", "São Bernardo do Campo", "Santo André", "Osasco", "Guarulhos"],
  "Sul": ["Curitiba", "Porto Alegre", "Florianópolis", "Londrina", "Maringá", "Pelotas", "Caxias do Sul", "Joinville", "Blumenau", "Ponta Grossa", "Cascavel", "Foz do Iguaçu"],
  "Nordeste": ["Salvador", "Recife", "Fortaleza", "João Pessoa", "Natal", "Maceió", "Aracaju", "São Luís", "Teresina", "Feira de Santana", "Caruaru", "Mossoró", "Vitória da Conquista", "Campina Grande", "Juazeiro do Norte"],
  "Centro-Oeste": ["Brasília", "Goiânia", "Cuiabá", "Campo Grande", "Anápolis", "Rondonópolis", "Várzea Grande", "Aparecida de Goiânia", "Dourados"],
  "Norte": ["Manaus", "Belém", "Porto Velho", "Macapá", "Rio Branco", "Boa Vista", "Palmas", "Santarém", "Ananindeua", "Marabá"],
};

const ETHNICITIES = [
  "parda, pele morena, traços mistos",
  "negra, pele escura, traços afrodescendentes",
  "branca, pele clara, traços europeus",
  "morena, pele bronzeada, traços brasileiros típicos",
  "negra retinta, pele bem escura, cabelos crespos",
  "parda clara, pele amorenada, cabelos ondulados",
  "asiática, descendente japonesa, traços orientais",
  "indígena, traços nativos brasileiros",
  "mulata, pele dourada, traços afro-brasileiros",
  "cafuza, mistura indígena e africana, pele acobreada"
];

const GENDER_BY_CNAE = {
  "Oficina Mecânica": "male",
  "Auto Peças": "male",
  "Auto Center": "male",
  "Salão de Beleza": "female",
  "Loja de Roupas": "female",
};

// Ações idle para primeira cena (usando mão não-dominante pois a dominante segura câmera)
const IDLE_ACTIONS = [
  "pose de herói olhando para câmera com confiança",
  "dando tchau para câmera com a outra mão e sorriso caloroso",
  "mostrando sua loja com gesto de orgulho usando a outra mão",
  "apontando para baixo na direita com a outra mão incentivando o click",
  "pose de empresário bem-sucedido sorrindo",
  "fazendo sinal de positivo com a outra mão",
  "acenando animado para a câmera com a outra mão",
  "pose de boas-vindas com o outro braço",
  "sorrindo e apontando para o ambiente de trabalho com a outra mão",
  "pose confiante de quem domina o negócio"
];

// API keys are now handled server-side via environment variables

const cnaeEl = document.getElementById("cnae");
const cnaeDropdownEl = document.getElementById("cnaeDropdown");
const regionEl = document.getElementById("region");
const cityEl = document.getElementById("city");
const genderEl = document.getElementById("gender");

const businessNameEl = document.getElementById("businessName");
const ownerNameEl = document.getElementById("ownerName");
const tpvEl = document.getElementById("tpv");
const avgTicketEl = document.getElementById("avgTicket");
const salesCountEl = document.getElementById("salesCount");
const onlineShareEl = document.getElementById("onlineShare");
const storefrontEl = document.getElementById("storefront");
const signatureItemEl = document.getElementById("signatureItem");
const productCalloutEl = document.getElementById("productCallout");

const shuffleBtn = document.getElementById("shuffleBtn");
const generateBtn = document.getElementById("generateBtn");
const enableImageEl = document.getElementById("enableImage");
const enableSeededitEl = document.getElementById("enableSeededit");
const useStartFrameEl = document.getElementById("useStartFrame");
const enableSeedanceEl = document.getElementById("enableSeedance");
const enableBRollEl = document.getElementById("enableBRoll");
const videoDuration10sEl = document.getElementById("videoDuration10s");
const totalPriceEl = document.getElementById("totalPrice");
const lockBtn = document.getElementById("lockBtn");
const overlayTextDisplayEl = document.getElementById("overlayTextDisplay");
const buttonTextDisplayEl = document.getElementById("buttonTextDisplay");
const customNotesDisplayEl = document.getElementById("customNotesDisplay");

const imageStatus = document.getElementById("imageStatus");
const seededitStatus = document.getElementById("seededitStatus");
const seedanceStatus = document.getElementById("seedanceStatus");
const imageContainer = document.getElementById("imageContainer");
const seededitContainer = document.getElementById("seededitContainer");
const seedanceContainer = document.getElementById("seedanceContainer");
const videoOverlay = document.getElementById("videoOverlay");

// Debug container initialization
console.log('🔧 DOM Elements initialized:');
console.log('  - imageContainer:', !!imageContainer);
console.log('  - seededitContainer:', !!seededitContainer);
console.log('  - seedanceContainer:', !!seedanceContainer);
console.log('  - videoOverlay:', !!videoOverlay);
console.log('  - shuffleBtn:', !!shuffleBtn);
console.log('  - lockBtn:', !!lockBtn);
console.log('  - videoDuration10sEl:', !!videoDuration10sEl);
console.log('  - productCalloutEl:', !!productCalloutEl);
const imagePromptEl = document.getElementById("imagePrompt");
const seedancePromptEl = document.getElementById("seedancePrompt");
const previewImageRadio = document.getElementById("previewImage");
const previewEditedRadio = document.getElementById("previewEdited");
const previewVideoRadio = document.getElementById("previewVideo");

// CNAE Search Variables
let filteredCnaeOptions = [];
let selectedCnaeIndex = -1;
let currentCnaeValue = "";

// Custom Values Tracking
let hasCustomOverlayText = false;
let hasCustomButtonText = false;
let hasCustomNotes = false;
let originalFormData = {};

// Lock state for custom values
let isLocked = false;

// CNAE Search Functions
function initCnaeSearch() {
  cnaeEl.addEventListener('input', handleCnaeInput);
  cnaeEl.addEventListener('focus', handleCnaeFocus);
  cnaeEl.addEventListener('blur', handleCnaeBlur);
  cnaeEl.addEventListener('keydown', handleCnaeKeydown);
  
  // Click outside to close dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cnae-search-container')) {
      hideCnaeDropdown();
    }
  });
}

function handleCnaeInput(e) {
  const query = e.target.value.trim();
  if (query.length === 0) {
    hideCnaeDropdown();
    currentCnaeValue = "";
    return;
  }
  
  filteredCnaeOptions = filterCnaeOptions(query);
  selectedCnaeIndex = -1;
  displayCnaeDropdown(filteredCnaeOptions);
}

function handleCnaeFocus(e) {
  const query = e.target.value.trim();
  if (query.length > 0) {
    filteredCnaeOptions = filterCnaeOptions(query);
    displayCnaeDropdown(filteredCnaeOptions);
  }
}

function handleCnaeBlur(e) {
  // Delay hiding to allow for clicks on dropdown items
  setTimeout(() => {
    hideCnaeDropdown();
  }, 150);
}

function handleCnaeKeydown(e) {
  if (!cnaeDropdownEl.classList.contains('show')) {
    if (e.key === 'Enter') {
      // Allow custom CNAE entry on Enter when dropdown is closed
      e.preventDefault();
      currentCnaeValue = cnaeEl.value.trim();
      cnaeEl.blur();
    }
    return;
  }
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedCnaeIndex = Math.min(selectedCnaeIndex + 1, filteredCnaeOptions.length - 1);
      updateCnaeHighlight();
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedCnaeIndex = Math.max(selectedCnaeIndex - 1, -1);
      updateCnaeHighlight();
      break;
    case 'Enter':
      e.preventDefault();
      if (selectedCnaeIndex >= 0) {
        selectCnaeOption(filteredCnaeOptions[selectedCnaeIndex]);
      } else {
        // Accept current input as custom CNAE
        currentCnaeValue = cnaeEl.value.trim();
        hideCnaeDropdown();
        cnaeEl.blur();
      }
      break;
    case 'Escape':
      hideCnaeDropdown();
      cnaeEl.blur();
      break;
  }
}

function filterCnaeOptions(query) {
  const lowerQuery = query.toLowerCase();
  return CNAE_OPTIONS.filter(option => {
    const lowerOption = option.toLowerCase();
    return lowerOption.includes(lowerQuery) || 
           lowerOption.replace(/[^a-z0-9]/g, '').includes(lowerQuery.replace(/[^a-z0-9]/g, ''));
  });
}

function displayCnaeDropdown(options) {
  cnaeDropdownEl.innerHTML = '';
  
  if (options.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'cnae-no-results';
    noResults.innerHTML = `
      <div>No matching CNAEs found</div>
      <small style="color: var(--green); margin-top: 4px; display: block;">
        💡 Press Enter to use "${cnaeEl.value}" as custom CNAE
      </small>
    `;
    cnaeDropdownEl.appendChild(noResults);
  } else {
    options.forEach((option, index) => {
      const optionEl = document.createElement('div');
      optionEl.className = 'cnae-option';
      optionEl.dataset.index = index;
      
      const [code, description] = option.split(' - ');
      optionEl.innerHTML = `
        <span class="cnae-code">${code}</span>
        <span class="cnae-description">- ${description}</span>
      `;
      
      optionEl.addEventListener('click', () => selectCnaeOption(option));
      cnaeDropdownEl.appendChild(optionEl);
    });
  }
  
  cnaeDropdownEl.classList.add('show');
  updateCnaeHighlight();
}

function hideCnaeDropdown() {
  cnaeDropdownEl.classList.remove('show');
  selectedCnaeIndex = -1;
}

function updateCnaeHighlight() {
  const options = cnaeDropdownEl.querySelectorAll('.cnae-option');
  options.forEach((option, index) => {
    option.classList.toggle('highlighted', index === selectedCnaeIndex);
  });
  
  // Scroll highlighted option into view
  if (selectedCnaeIndex >= 0 && options[selectedCnaeIndex]) {
    options[selectedCnaeIndex].scrollIntoView({ block: 'nearest' });
  }
}

function selectCnaeOption(option) {
  cnaeEl.value = option;
  currentCnaeValue = option;
  hideCnaeDropdown();
  cnaeEl.blur();
}

// Custom Text Tracking Functions
function initCustomTextTracking() {
  // Track when user modifies overlay text
  overlayTextDisplayEl.addEventListener('input', () => {
    hasCustomOverlayText = overlayTextDisplayEl.value.trim() !== '';
    updateTextInputStatus();
  });
  
  // Track when user modifies button text
  buttonTextDisplayEl.addEventListener('input', () => {
    hasCustomButtonText = buttonTextDisplayEl.value.trim() !== '';
    updateTextInputStatus();
  });
  
  // Track when user modifies custom notes
  customNotesDisplayEl.addEventListener('input', () => {
    hasCustomNotes = customNotesDisplayEl.value.trim() !== '';
    updateTextInputStatus();
  });
  
  // Update overlay text in real-time
  overlayTextDisplayEl.addEventListener('input', () => {
    updateOverlayText(overlayTextDisplayEl.value, buttonTextDisplayEl.value);
  });
  
  // Update button text in real-time
  buttonTextDisplayEl.addEventListener('input', () => {
    updateOverlayText(overlayTextDisplayEl.value, buttonTextDisplayEl.value);
  });
  
  // Add visual feedback for custom business/owner names
  businessNameEl.addEventListener('input', () => {
    if (businessNameEl.value.trim()) {
      businessNameEl.parentElement.classList.add('has-custom-value');
    } else {
      businessNameEl.parentElement.classList.remove('has-custom-value');
    }
  });
  
  ownerNameEl.addEventListener('input', () => {
    if (ownerNameEl.value.trim()) {
      ownerNameEl.parentElement.classList.add('has-custom-value');
    } else {
      ownerNameEl.parentElement.classList.remove('has-custom-value');
    }
  });
  
  // Add visual feedback for custom product callout
  productCalloutEl.addEventListener('input', () => {
    if (productCalloutEl.value.trim() && productCalloutEl.value.trim() !== "Gestão digital") {
      productCalloutEl.parentElement.classList.add('has-custom-value');
    } else {
      productCalloutEl.parentElement.classList.remove('has-custom-value');
    }
  });
}

function updateTextInputStatus() {
  // Add visual indicator for custom values
  if (hasCustomOverlayText) {
    overlayTextDisplayEl.parentElement.classList.add('has-custom-value');
  } else {
    overlayTextDisplayEl.parentElement.classList.remove('has-custom-value');
  }
  
  if (hasCustomButtonText) {
    buttonTextDisplayEl.parentElement.classList.add('has-custom-value');
  } else {
    buttonTextDisplayEl.parentElement.classList.remove('has-custom-value');
  }
  
  if (hasCustomNotes) {
    customNotesDisplayEl.parentElement.classList.add('has-custom-value');
  } else {
    customNotesDisplayEl.parentElement.classList.remove('has-custom-value');
  }
}

function captureFormData() {
  originalFormData = {
    businessName: businessNameEl.value.trim(),
    ownerName: ownerNameEl.value.trim(),
    cnae: cnaeEl.value.trim(),
    region: regionEl.value,
    city: cityEl.value,
    gender: genderEl.value,
    tpv: tpvEl.value,
    avgTicket: avgTicketEl.value,
    salesCount: salesCountEl.value,
    onlineShare: onlineShareEl.value,
    storefront: storefrontEl.value,
    signatureItem: signatureItemEl.value.trim(),
    productCallout: productCalloutEl.value.trim()
  };
}

function hasNonEmptyFormData() {
  return originalFormData.businessName || 
         originalFormData.ownerName || 
         originalFormData.cnae || 
         originalFormData.tpv || 
         originalFormData.avgTicket || 
         originalFormData.salesCount || 
         originalFormData.onlineShare || 
         originalFormData.signatureItem ||
         originalFormData.productCallout;
}

init();

function init() {
  // Initialize CNAE search functionality
  initCnaeSearch();
  
  // Initialize custom text tracking
  initCustomTextTracking();
  
  // Capture initial empty state
  captureFormData();
  
  Object.keys(REGIONS).forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r; opt.textContent = r; regionEl.appendChild(opt);
  });
  regionEl.addEventListener("change", updateCities);
  updateCities();

  // API keys are handled server-side, no localStorage needed

  shuffleBtn.addEventListener("click", onShuffle);
  generateBtn.addEventListener("click", onGenerate);
  
  // Lock button functionality
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      isLocked = !isLocked;
      lockBtn.textContent = isLocked ? '🔒' : '🔓';
      lockBtn.classList.toggle('locked', isLocked);
      shuffleBtn.disabled = isLocked;
    });
  }

  // Preview mode switching
  previewImageRadio.addEventListener("change", updatePreviewMode);
  previewEditedRadio.addEventListener("change", updatePreviewMode);
  previewVideoRadio.addEventListener("change", updatePreviewMode);

  // Pricing calculation event listeners
  if (enableImageEl) enableImageEl.addEventListener('change', () => {
    updatePricing();
    updateOptionDependencies();
  });
  if (enableSeededitEl) enableSeededitEl.addEventListener('change', updatePricing);
  if (enableSeedanceEl) enableSeedanceEl.addEventListener('change', () => {
    updatePricing();
    updateStartFrameVisualFeedback();
    updateVideoOptionDependencies();
  });
  if (enableBRollEl) enableBRollEl.addEventListener('change', updatePricing);
  if (videoDuration10sEl) videoDuration10sEl.addEventListener('change', updatePricing);
  if (useStartFrameEl) useStartFrameEl.addEventListener('change', () => {
    updatePricing();
    updateStartFrameVisualFeedback();
  });

  // Initialize pricing, dependencies, and start frame feedback
  updatePricing();
  updateOptionDependencies();
  updateVideoOptionDependencies();
  updateStartFrameVisualFeedback();

  // No API card hiding needed since it's removed from HTML
}

// Profile toggle function  
window.toggleProfile = function() {
  console.log('toggleProfile called');
  const profileSection = document.querySelector('.profile-section');
  if (profileSection) {
    profileSection.classList.toggle('collapsed');
    console.log('Profile collapsed state:', profileSection.classList.contains('collapsed'));
  } else {
    console.error('Profile section not found');
  }
}

// Pricing calculation
function updatePricing() {
  let total = 0;
  
  if (enableImageEl && enableImageEl.checked) {
    total += 0.03; // Seedream
  }
  
  if (enableSeededitEl && enableSeededitEl.checked) {
    total += 0.03; // Seededit
  }
  
  if (enableSeedanceEl && enableSeedanceEl.checked) {
    const duration = (videoDuration10sEl && videoDuration10sEl.checked) ? 10 : 5;
    total += duration * 0.018; // Seedance Lite 480p ($0.018 per second)
  }
  
  // B-Roll and start frame are free, no cost
  
  if (totalPriceEl) {
    totalPriceEl.textContent = `$${total.toFixed(2)}`;
  }
  
  // Update option dependencies
  updateOptionDependencies();
}

function updateOptionDependencies() {
  // Text removal requires image generation
  const isImageEnabled = enableImageEl && enableImageEl.checked;
  if (enableSeededitEl) {
    enableSeededitEl.disabled = !isImageEnabled;
    
    const seededitLabel = enableSeededitEl.closest('.option-toggle');
    if (seededitLabel) {
      const optionText = seededitLabel.querySelector('.option-text');
      if (optionText) {
        if (!isImageEnabled) {
          optionText.textContent = 'Remove Text from Image (Requires image generation)';
        } else {
          optionText.textContent = 'Remove Text from Image';
        }
      }
    }
  }
}

function updateVideoOptionDependencies() {
  // B-Roll and duration extension require video generation
  const isVideoEnabled = enableSeedanceEl && enableSeedanceEl.checked;
  
  // Update B-Roll option
  if (enableBRollEl) {
    enableBRollEl.disabled = !isVideoEnabled;
    const brollLabel = enableBRollEl.closest('.option-toggle');
    if (brollLabel) {
      const optionText = brollLabel.querySelector('.option-text');
      if (optionText) {
        if (!isVideoEnabled) {
          optionText.textContent = 'Add B-Roll Scene (Requires video generation)';
        } else {
          optionText.textContent = 'Add B-Roll Scene';
        }
      }
    }
  }
  
  // Update duration option
  if (videoDuration10sEl) {
    videoDuration10sEl.disabled = !isVideoEnabled;
    const durationLabel = videoDuration10sEl.closest('.option-toggle');
    if (durationLabel) {
      const optionText = durationLabel.querySelector('.option-text');
      if (optionText) {
        if (!isVideoEnabled) {
          optionText.textContent = '+5 seconds duration (Requires video generation)';
        } else {
          optionText.textContent = '+5 seconds duration';
        }
      }
    }
  }
}

function updateCities() {
  const region = regionEl.value || Object.keys(REGIONS)[0];
  cityEl.innerHTML = "";
  (REGIONS[region] || []).forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c; cityEl.appendChild(opt);
  });
}

// Better random seed generation
function generateBetterRandomSeed() {
  if (window.crypto && window.crypto.getRandomValues) {
    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    return randomArray[0] % 1000000;
  } else {
    // Fallback with better entropy
    return Math.floor((Math.random() * Date.now()) % 1000000);
  }
}

// Generate seed variation based on master seed for different models
function generateSeedVariation(masterSeed, variation) {
  // Create predictable but different seeds for each model based on master
  const hash = (masterSeed + variation) * 9973; // Large prime for distribution
  return Math.abs(hash) % 1000000;
}

function getRandomFromArray(array) {
  if (window.crypto && window.crypto.getRandomValues) {
    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    return array[randomArray[0] % array.length];
  } else {
    return array[Math.floor(Math.random() * array.length)];
  }
}

function getRandomEthnicity() {
  return getRandomFromArray(ETHNICITIES);
}

function getRandomClothingColor() {
  const random = Math.random();
  
  if (random < 0.75) {
    // 75% - black, white, or tan
    const neutralColors = [
      "roupa preta", 
      "roupa branca", 
      "roupa bege claro", 
      "roupa marrom claro", 
      "roupa creme",
      "roupa off-white"
    ];
    return neutralColors[Math.floor(Math.random() * neutralColors.length)];
    
  } else if (random < 0.87) {
    // 12% - purple hues (soft, pale, lilac, lavender)
    const purpleColors = [
      "roupa lilás suave",
      "roupa lavanda pálida", 
      "roupa roxo claro",
      "roupa violeta suave",
      "roupa lilás pastel",
      "roupa lavanda delicada"
    ];
    return purpleColors[Math.floor(Math.random() * purpleColors.length)];
    
  } else {
    // 12% - green tones (soft lime, avocado, pale green)
    const greenColors = [
      "roupa verde lima suave",
      "roupa verde abacate", 
      "roupa verde claro",
      "roupa verde menta pálido",
      "roupa verde lima pálido",
      "roupa verde pistache suave"
    ];
    return greenColors[Math.floor(Math.random() * greenColors.length)];
  }
}

function getRandomIdleAction() {
  return getRandomFromArray(IDLE_ACTIONS);
}

function getBRollText(cnae, city) {
  // Let the LLM handle B-roll generation intelligently
  return '';
}

function updatePreviewMode() {
  if (!videoOverlay) return;
  
  const showImage = previewImageRadio.checked;
  const showEdited = previewEditedRadio.checked;
  const showVideo = previewVideoRadio.checked;
  const videoPlaceholder = videoOverlay.querySelector('.video-placeholder');
  
  if (showImage) {
    // Show the original generated image in the preview
    const imageInCenter = imageContainer.querySelector('img');
    if (imageInCenter && videoPlaceholder) {
      videoPlaceholder.innerHTML = '';
      videoPlaceholder.className = 'video-placeholder with-content'; // Add class for content centering
      const previewImg = document.createElement('img');
      previewImg.src = imageInCenter.src;
      previewImg.style.width = '100%';
      previewImg.style.height = '100%';
      previewImg.style.objectFit = 'cover';
      videoPlaceholder.appendChild(previewImg);
    }
  } else if (showEdited) {
    // Show the edited image in the preview
    const editedImageInCenter = seededitContainer.querySelector('img');
    console.log('🔧 Edited image preview mode - found edited image element:', !!editedImageInCenter);
    if (editedImageInCenter) {
      console.log('🔧 Edited image src:', editedImageInCenter.src);
    }
    if (editedImageInCenter && videoPlaceholder) {
      console.log('✅ Creating edited image preview');
      videoPlaceholder.innerHTML = '';
      videoPlaceholder.className = 'video-placeholder with-content'; // Add class for content centering
      const previewImg = document.createElement('img');
      previewImg.src = editedImageInCenter.src;
      previewImg.style.width = '100%';
      previewImg.style.height = '100%';
      previewImg.style.objectFit = 'cover';
      previewImg.onload = () => {
        console.log('✅ Edited image preview loaded successfully');
      };
      previewImg.onerror = (e) => {
        console.error('❌ Edited image preview loading error:', e);
      };
      videoPlaceholder.appendChild(previewImg);
    } else {
      console.log('⚠️ No edited image available for preview');
    }
  } else if (showVideo) {
    // Show the generated video in the preview (if available)
    const videoInCenter = seedanceContainer.querySelector('video');
    console.log('🎬 Video preview mode - found video element:', !!videoInCenter);
    if (videoInCenter) {
      console.log('🎬 Video src:', videoInCenter.src);
    }
    if (videoInCenter && videoPlaceholder) {
      console.log('✅ Creating video preview');
      videoPlaceholder.innerHTML = '';
      videoPlaceholder.className = 'video-placeholder with-content'; // Add class for content centering
      const previewVideo = document.createElement('video');
      previewVideo.src = videoInCenter.src;
      previewVideo.muted = true; // Seedance videos don't have audio
      previewVideo.loop = true;
      previewVideo.autoplay = true;
      previewVideo.style.width = '100%';
      previewVideo.style.height = '100%';
      previewVideo.style.objectFit = 'cover';
      previewVideo.id = 'previewVideoElement';
      previewVideo.onloadedmetadata = () => {
        console.log('✅ Preview video metadata loaded');
      };
      previewVideo.onerror = (e) => {
        console.error('❌ Preview video loading error:', e);
      };
      videoPlaceholder.appendChild(previewVideo);
    } else {
      // No video available, show placeholder
      console.log('⚠️ No video available for preview');
      videoPlaceholder.className = 'video-placeholder'; // Reset to default for placeholder text
      videoPlaceholder.innerHTML = '<span>Generated video will appear here</span>';
    }
  } else {
    // Default case - show placeholder
    if (videoPlaceholder) {
      videoPlaceholder.className = 'video-placeholder'; // Reset to default for placeholder text
      videoPlaceholder.innerHTML = '<span>Generated video will appear here</span>';
    }
  }
}

// Audio removed - Seedance videos don't have audio

function updateStartFrameVisualFeedback() {
  const useStartFrameLabel = useStartFrameEl?.closest('.option-toggle');
  if (!useStartFrameLabel) return;
  
  const hasImage = imageContainer.querySelector('img') !== null;
  const hasEditedImage = seededitContainer?.querySelector('img') !== null;
  const isVideoEnabled = enableSeedanceEl.checked;
  const isStartFrameChecked = useStartFrameEl.checked;
  
  // Only disable if video generation is disabled (user can set preference before generating)
  useStartFrameEl.disabled = !isVideoEnabled;
  
  // Add visual feedback classes
  useStartFrameLabel.classList.toggle('start-frame-active', isStartFrameChecked && isVideoEnabled);
  
  // Update option text based on state
  const optionText = useStartFrameLabel.querySelector('.option-text');
  if (optionText) {
    if (!isVideoEnabled) {
      optionText.textContent = 'Use Image as Start Frame (Video disabled)';
    } else {
      optionText.textContent = 'Use Image as Start Frame';
    }
  }
  
  console.log('🎯 Start frame status:', {
    hasImage,
    hasEditedImage,
    isVideoEnabled,
    isStartFrameChecked,
    isDisabled: useStartFrameEl.disabled
  });
}

// Simular animação do carrossel
function animateCarousel() {
  const indicators = document.querySelectorAll('.indicator');
  if (indicators.length === 0) return;
  
  let currentIndex = 0;
  
  setInterval(() => {
    // Remove active de todos
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Adiciona active no atual
    indicators[currentIndex].classList.add('active');
    
    // Próximo índice
    currentIndex = (currentIndex + 1) % indicators.length;
  }, 2000); // Muda a cada 2 segundos
}

// Iniciar animação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(animateCarousel, 1000); // Inicia após 1 segundo
  // Authentication now required - no client-side API key fallback
});

async function onShuffle() {
  try {
    // Prevent rapid clicking
    if (shuffleBtn.disabled) return;
    shuffleBtn.disabled = true;
    shuffleBtn.textContent = "Shuffling...";
    
    // Capture current form data before shuffle
    captureFormData();
    
    // Add cache-busting timestamp for better randomization
    const timestamp = Date.now();
    const res = await fetch(`./clients.sample.json?t=${timestamp}`);
    const list = await res.json();
    
    // Better randomization: use crypto.getRandomValues if available, fallback to Math.random
    let randomIndex;
    if (window.crypto && window.crypto.getRandomValues) {
      const randomArray = new Uint32Array(1);
      window.crypto.getRandomValues(randomArray);
      randomIndex = randomArray[0] % list.length;
    } else {
      randomIndex = Math.floor(Math.random() * list.length);
    }
    
    const sample = list[randomIndex];
    console.log(`🎲 Shuffled profile ${randomIndex}/${list.length}:`, sample.businessName, '-', sample.ownerName);
    
    // Add random time of day for variance
    const timesOfDay = ['Amanhecer', 'Meio-dia ensolarado', 'Final de tarde', 'Anoitecer', 'Noite'];
    const randomTime = timesOfDay[Math.floor(Math.random() * timesOfDay.length)];
    
    // Check if we should preserve custom values
    const shouldLockCustom = isLocked;
    fillForm(sample, shouldLockCustom);
    
    // Store random time for prompt generation
    window.randomTimeOfDay = randomTime;
    
    // Re-enable button after a short delay
    setTimeout(() => {
      shuffleBtn.disabled = false;
      shuffleBtn.textContent = "🎲 Shuffle";
    }, 1000);
  } catch (e) {
    console.error(e);
    shuffleBtn.disabled = false;
    shuffleBtn.textContent = "🎲 Shuffle";
  }
}

function fillForm(d, shouldLockCustom = false) {
  // Only fill if not locked or if the field is empty
  if (!shouldLockCustom || !originalFormData.businessName) {
    businessNameEl.value = d.businessName || "";
  }
  if (!shouldLockCustom || !originalFormData.ownerName) {
    ownerNameEl.value = d.ownerName || "";
  }
  if (!shouldLockCustom || !originalFormData.cnae) {
    selectValue(cnaeEl, d.cnae);
  }
  if (!shouldLockCustom) {
    selectValue(regionEl, d.region);
    updateCities();
    selectValue(cityEl, d.city);
    selectValue(genderEl, d.gender || "");
  }
  if (!shouldLockCustom || !originalFormData.tpv) {
    tpvEl.value = d.tpv ?? "";
  }
  if (!shouldLockCustom || !originalFormData.avgTicket) {
    avgTicketEl.value = d.avgTicket ?? "";
  }
  if (!shouldLockCustom || !originalFormData.salesCount) {
    salesCountEl.value = d.salesCount ?? "";
  }
  if (!shouldLockCustom || !originalFormData.onlineShare) {
    onlineShareEl.value = d.onlineShare ?? "";
  }
  if (!shouldLockCustom) {
    selectValue(storefrontEl, d.storefront || "street");
  }
  if (!shouldLockCustom || !originalFormData.signatureItem) {
    signatureItemEl.value = d.signatureItem || "";
  }
  // Don't shuffle productCallout - it's user's custom setting that should be preserved
}

function selectValue(element, val) {
  if (element.id === 'cnae') {
    // Handle CNAE search input
    element.value = val || "";
    currentCnaeValue = val || "";
  } else {
    // Handle regular select elements
    const idx = Array.from(element.options).findIndex(o => o.value === val);
    element.selectedIndex = idx >= 0 ? idx : 0;
  }
}

// API key functions removed - handled server-side

async function onGenerate() {
  // Check authentication first
  if (window.cloudwalkAuth && !window.cloudwalkAuth.requireAuth()) {
    return;
  }

  // Require authentication - no client-side fallback
  if (!window.cloudwalkAuth?.isAuthenticated || !window.cloudwalkAuth?.user?.accessToken) {
    alert('🔐 Authentication Required\n\nPlease sign in with your @cloudwalk.io account to access the application.\n\nAPI keys are managed securely on the server.');
    return;
  }
  
  console.log('🔑 Using authenticated session with server-side API keys');

  // Generate MASTER SEED for this generation cycle
  const masterSeed = generateBetterRandomSeed();
  console.log(`🎲 MASTER SEED for this generation: ${masterSeed}`);
  
  // Store master seed globally for this generation cycle
  window.currentMasterSeed = masterSeed;

  lockUI(true);
  clearOutputs();

  const profile = buildUserProfile();
  console.log('🔍 Profile data being sent to OpenAI:', profile); // Debug
  const promptResult = await callOpenAIForPrompts(profile);
  if (!promptResult) {
    lockUI(false);
    return;
  }

  // ALWAYS display prompts regardless of checkbox status
  displayPrompts(promptResult);

  // Generate based on checkbox selections in proper order: image, seededit, video
  let imageUrl = null;
  let editedImageUrl = null;
  let seedanceUrl = null;
  
  // Step 1: Generate image first if needed
  if (enableImageEl.checked) {
    imageStatus.innerHTML = '🎨 Generating image (~30s)… <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 20px; height: 20px; vertical-align: middle;">';
    // Add loading GIF to image container
    imageContainer.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 200px; flex-direction: column;"><img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 80px; height: 80px;"><p style="margin-top: 10px; color: #a8a8ad; font-size: 14px;">Generating image...</p></div>';
    imageUrl = await generateImage(promptResult.image_prompt);
  } else {
    imageStatus.textContent = "Disabled (checkbox unchecked)";
  }
  
  // Step 2: Remove text from image if needed and image was generated
  if (enableSeededitEl.checked && imageUrl) {
    if (seededitStatus) seededitStatus.innerHTML = '🔧 Removing text (~45s)… <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 20px; height: 20px; vertical-align: middle;">';
    // Add loading GIF to seededit container
    if (seededitContainer) seededitContainer.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 200px; flex-direction: column;"><img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 80px; height: 80px;"><p style="margin-top: 10px; color: #a8a8ad; font-size: 14px;">Removing text...</p></div>';
    editedImageUrl = await generateSeededit(imageUrl);
  } else if (enableSeededitEl.checked && !imageUrl) {
    if (seededitStatus) seededitStatus.textContent = "No image to process (image generation disabled or failed)";
  } else {
    if (seededitStatus) seededitStatus.textContent = "Disabled (checkbox unchecked)";
  }
  
  // Step 3: Generate video with or without start frame
  if (enableSeedanceEl.checked) {
    const selectedDuration = (videoDuration10sEl && videoDuration10sEl.checked) ? 10 : 5;
    if (seedanceStatus) seedanceStatus.innerHTML = `🎬 Generating ${selectedDuration}s video (~1-2 min)… <img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 20px; height: 20px; vertical-align: middle;">`;
    // Add loading GIF to video container
    if (seedanceContainer) seedanceContainer.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 200px; flex-direction: column;"><img src="https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif" style="width: 80px; height: 80px;"><p style="margin-top: 10px; color: #a8a8ad; font-size: 14px;">Generating ${selectedDuration}s video...</p></div>`;
    
    // Use start frame: prefer edited image, fallback to original image
    let startFrameUrl = null;
    
    try {
      console.log('🔍 Start frame checkbox element found:', !!useStartFrameEl);
      console.log('🔍 Start frame checkbox state:', useStartFrameEl?.checked);
      console.log('🔍 Available URLs for start frame:');
      console.log('  - imageUrl:', imageUrl || 'null');
      console.log('  - editedImageUrl:', editedImageUrl || 'null');
      
      if (useStartFrameEl && useStartFrameEl.checked) {
        const candidateUrl = editedImageUrl || imageUrl;
        console.log('🔍 Chosen candidate URL:', candidateUrl ? candidateUrl.substring(0, 50) + '...' : 'null');
        console.log('🔍 Choice logic: editedImageUrl || imageUrl →', editedImageUrl ? 'editedImageUrl' : 'imageUrl');
        
        // Validate start frame URL before using it
        if (candidateUrl) {
          try {
            new URL(candidateUrl);
            startFrameUrl = candidateUrl;
            console.log('✅ Valid start frame URL confirmed:', startFrameUrl.substring(0, 50) + '...');
          } catch (e) {
            console.error('❌ Invalid start frame URL:', candidateUrl, e);
            console.warn('⚠️ Proceeding without start frame due to invalid URL');
            startFrameUrl = null;
          }
        } else {
          console.log('ℹ️ Start frame enabled but no image available - proceeding without start frame');
        }
      } else {
        console.log('ℹ️ Start frame disabled - proceeding without start frame');
      }
    } catch (error) {
      console.error('❌ Error in start frame selection logic:', error);
      console.log('⚠️ Proceeding without start frame due to error');
      startFrameUrl = null;
    }
    
    seedanceUrl = await generateSeedanceVideo(promptResult.video_prompt, startFrameUrl);
  } else {
    if (seedanceStatus) seedanceStatus.textContent = "Disabled (checkbox unchecked)";
  }
  
  console.log('Generation complete:', { 
    imageUrl: imageUrl ? imageUrl.substring(0, 50) + '...' : null, 
    seedanceUrl: seedanceUrl ? seedanceUrl.substring(0, 50) + '...' : null,
    imageEnabled: enableImageEl.checked,
    seedanceEnabled: enableSeedanceEl.checked
  });
  
  // Additional debug logging
  if (imageUrl) console.log('🔗 Full imageUrl:', imageUrl);
  if (seedanceUrl) console.log('🎬 Full seedanceUrl:', seedanceUrl);

  lockUI(false);
}

function lockUI(disabled) {
  generateBtn.disabled = disabled;
  shuffleBtn.disabled = disabled;
}

function clearOutputs() {
  // Set placeholder content for image and video containers
  imageContainer.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 200px; color: #666; font-size: 14px;">Image will appear here</div>';
  if (seededitContainer) seededitContainer.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 200px; color: #666; font-size: 14px;">Text removed image will appear here</div>';
  if (seedanceContainer) seedanceContainer.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 200px; color: #666; font-size: 14px;">Video will appear here</div>';
  
  imagePromptEl.innerHTML = "";
  if (seedancePromptEl) seedancePromptEl.innerHTML = "";
  imagePromptEl.classList.remove("show");
  if (seedancePromptEl) seedancePromptEl.classList.remove("show");
  imageStatus.textContent = "Waiting…";
  if (seededitStatus) seededitStatus.textContent = "Waiting…";
  if (seedanceStatus) seedanceStatus.textContent = "Waiting…";
  
  // Update start frame visual feedback
  updateStartFrameVisualFeedback();
}

function displayPrompts(promptResult) {
  // Always show image prompt
  imagePromptEl.textContent = `Image Prompt:\n${promptResult.image_prompt}`;
  imagePromptEl.classList.add("show");
  
  // Always show video prompt  
  if (seedancePromptEl) {
    seedancePromptEl.textContent = `Seedance Video Prompt:\n${promptResult.video_prompt}`;
    seedancePromptEl.classList.add("show");
  }
  
  // Update text inputs only if they don't have custom values
  if (!hasCustomOverlayText && promptResult.overlay_text) {
    overlayTextDisplayEl.value = promptResult.overlay_text;
  }
  
  if (!hasCustomButtonText && promptResult.button_text) {
    buttonTextDisplayEl.value = promptResult.button_text;
  }
  
  // Always update the app preview with current values (custom or generated)
  const currentOverlayText = overlayTextDisplayEl.value || promptResult.overlay_text;
  const currentButtonText = buttonTextDisplayEl.value || promptResult.button_text;
  updateOverlayText(currentOverlayText, currentButtonText);
}

function updateOverlayText(overlayText, buttonText) {
  // Update the text overlay in the app preview
  const textOverlay = document.querySelector('.text-overlay p');
  const ctaButton = document.querySelector('.cta-button');
  
  if (textOverlay && overlayText) {
    textOverlay.textContent = overlayText;
  }
  
  if (ctaButton && buttonText) {
    ctaButton.textContent = buttonText;
  }
}

function buildUserProfile() {
  const cnae = cnaeEl.value;
  const region = regionEl.value;
  const city = cityEl.value;
  const gender = genderEl.value || (GENDER_BY_CNAE[cnae] || "");
  return {
    businessName: businessNameEl.value.trim(),
    ownerName: ownerNameEl.value.trim(),
    cnae, region, city,
    gender,
    tpv: Number(tpvEl.value || 0),
    avgTicket: Number(avgTicketEl.value || 0),
    salesCount: Number(salesCountEl.value || 0),
    onlineShare: Number(onlineShareEl.value || 0),
    storefront: storefrontEl.value,
    signatureItem: signatureItemEl.value.trim(),
    productCallout: productCalloutEl.value.trim() || "Gestão digital",
  };
}

async function callOpenAIForPrompts(profile) {
  try {
    console.log('🎯 OpenAI prompt generation for profile:', profile); // Debug
    console.log('📝 CNAE:', profile.cnae);
    console.log('👤 Dono:', profile.ownerName, '| Gênero:', profile.gender);
    console.log('🏙️ Local:', profile.city, profile.region);
    
    // Randomize time of day for each generation
    const timesOfDay = ['Amanhecer', 'Meio-dia ensolarado', 'Final de tarde', 'Anoitecer', 'Noite'];
    const randomTimeOfDay = timesOfDay[Math.floor(Math.random() * timesOfDay.length)];
    

    
    console.log('🌅 Horário randomizado:', randomTimeOfDay); // Debug
    
    const randomEthnicity = getRandomEthnicity();
    const randomClothing = getRandomClothingColor();
    const randomIdleAction = getRandomIdleAction();
    
    console.log('🎭 Ação idle randomizada:', randomIdleAction);
    console.log('🎨 Etnia randomizada:', randomEthnicity);
    console.log('👕 Roupa randomizada:', randomClothing);
    
    // Check if B-Roll is enabled
    const isBRollEnabled = enableBRollEl && enableBRollEl.checked;
    
    // Check video duration setting
    const is10SecondVideo = videoDuration10sEl && videoDuration10sEl.checked;
    const videoDuration = is10SecondVideo ? 10 : 5;
    
    console.log('🎬 B-Roll enabled:', isBRollEnabled);
    console.log('🎬 Video duration:', videoDuration, 'seconds');
    
    const system = `Você é um roteirista e especialista em criação de prompts descritivos para geração de imagens e vídeos realistas em estilo POV (primeira pessoa) e selfie vlog com ultra realismo, 4K, coerência narrativa.

Sua tarefa é criar **dois prompts cinematográficos em português** para cada cliente:
1. Um para IMAGEM (pessoa segurando celular em selfie)
2. Um para VÍDEO Seedance (pessoa em ação idle, depois falando para câmera)

⚠️ ALERTA CRÍTICO DE COMPLIANCE: NUNCA use dados pessoais reais (nomes, empresas). Crie SEMPRE personagens genéricos anônimos. Impersonation é proibida por lei.

RETORNE JSON com 'image_prompt' e 'video_prompt'.`;
    const brand = `Generate two separate cinematic prompts: one for image and one for video.`;
    const user = {
      instruction: "Create two separate cinematic prompts in Portuguese: one for image generation and one for video generation featuring business owners in their work environment.",
      constraints: {
        language: "pt-BR",
        videoModel: "bytedance/seedance-1-lite",
        imageModel: "bytedance/seedream-3",
      },
      profile,
      outputs: [
        "image_prompt",
        "video_prompt",
        "overlay_text",
        "button_text"
      ],
      brand,
      ethnicity: randomEthnicity,
      rules: [
        "CRÍTICO: NUNCA use nomes pessoais reais. NUNCA diga 'sou [nome]' ou 'meu nome é [nome]'. Use apenas 'Oi!' ou 'Olá!'.",
        "CRÍTICO: NUNCA use nomes de empresas reais. NUNCA mencione o nome da loja/empresa do cliente. Use termos genéricos como 'uma loja', 'um estabelecimento', 'uma empresa'.",
        "CRÍTICO: NUNCA use 'o personagem' - use 'uma mulher', 'um homem', etc. para evitar personagens de anime.",
        "CRÍTICO: SEM LETREIROS - Nunca inclua placas, letreiros, nomes de lojas, textos visíveis ou escritas de qualquer tipo nas descrições.",
        `HORÁRIOS: Use preferencialmente '${randomTimeOfDay}' ou horários naturais similares como 'Seis horas da manhã', 'Final de tarde', 'Início da manhã'`,
        "AMBIENTES EXTERNOS: Para atividades ao ar livre, use pontos turísticos da cidade (Cristo Redentor-RJ, Elevador Lacerda-Salvador, Avenida Paulista-SP, Pelourinho-Salvador, Pão de Açúcar-RJ, etc.)",
        `ETNIA OBRIGATÓRIA: Use sempre '${randomEthnicity}' para garantir diversidade racial brasileira`,
        `CIDADE OBRIGATÓRIA: Use sempre '${profile.city}' (SEM região) - NUNCA use outras cidades.`,
        `CNAE DO CLIENTE: ${profile.cnae || 'negócio genérico'} - USE O TIPO ESPECÍFICO DE NEGÓCIO (loja de instrumentos musicais, marcenaria, restaurante, etc.)`,
        `GÊNERO E PROFISSÃO: Analise o nome "${profile.ownerName}" para determinar gênero e combine com CNAE "${profile.cnae}" para criar título profissional apropriado:`,
        `Exemplos: "uma dentista", "um açougueiro", "uma tatuadora", "um mecânico", "uma farmacêutica", "um advogado", etc.`,
        `Para negócios sem profissão específica, use "um empresário" ou "uma empresária".`,
        `IMPORTANTE: NÃO descreva aparência física (barba, cabelo, idade específica). Use apenas [título profissional] + [etnia] + [cidade].`,
        `CONTEXTO PROFISSIONAL: Determine roupa e localização apropriadas para a profissão baseado no CNAE. Exemplos:`,
        `- Farmácia: jaleco branco, interior com prateleiras de medicamentos`,
        `- Tatuagem: roupa preta, interior com cadeiras de tatuagem e arte nas paredes`,
        `- Marcenaria: uniforme de trabalho, interior com madeiras e ferramentas`,
        `- Padaria: avental, interior com fornos e pães expostos`,
        `- Oficina: macacão, interior com carros e ferramentas`,
        `- Restaurante: uniforme de chef, interior de cozinha ou salão`,
        `- Barbearia: avental, interior com poltronas e espelhos`,
        `- Instrumento musical: roupa casual, interior com violões e instrumentos expostos`,
        "",
        "ESTRUTURA PARA IMAGE_PROMPT:",
        "1. CÂMERA: 'Foto estilo selfie, perspectiva de primeira pessoa, ângulo de selfie, sem câmera visível.'",
        "2. HORÁRIO + AMBIENTAÇÃO: Use o horário, tipo de negócio e cidade fornecidos. Interior/exterior baseado na profissão.",
        "3. PERSONAGEM: Determine gênero pelo nome, crie título profissional baseado no CNAE, use etnia e cidade fornecidas.",
        "4. CONTEXTO DO TRABALHO: Mostre elementos relacionados ao trabalho/profissão no ambiente (sem texto visível).",
        "",
        "ESTRUTURA PARA VIDEO_PROMPT:",
        "1. CÂMERA: 'Foto estilo selfie, perspectiva de primeira pessoa, ângulo de selfie, sem câmera visível. Com a câmera Selfie VLOG, próxima ao rosto. Câmera subjetiva, POV.'",
        ...(isBRollEnabled ? [
          "2. PRIMEIRA CENA (VLOG STYLE): Horário + Ambientação: Mesmo ambiente da imagem, usando dados fornecidos. Personagem: Mesmo personagem da imagem, com ação idle apropriada (use mão não-dominante pois a mão principal segura a câmera). Contexto do trabalho: Mostre elementos relacionados ao trabalho/profissão no ambiente (sem texto visível).",
          "3. CORTA PARA SEGUNDA CENA (B-ROLL): Adicione cena mostrando a MESMA PESSOA, com a mesma roupa, no momento seguinte, fazendo o trabalho específico da profissão. Use interior do estabelecimento ou exterior/paisagem da cidade se for trabalho externo (ex: jardineiro, construção). Seja específico sobre a atividade profissional real."
        ] : [
          "2. CENA ÚNICA (VLOG STYLE): Horário + Ambientação: Mesmo ambiente da imagem, usando dados fornecidos. Personagem: Mesmo personagem da imagem, com ação idle apropriada (use mão não-dominante pois a mão principal segura a câmera). Contexto do trabalho: Mostre elementos relacionados ao trabalho/profissão no ambiente (sem texto visível)."
        ]),
        "",
        `EXEMPLOS DE ESTRUTURA (adapte para o perfil específico):`,
        `IMAGE EXEMPLO: 'Foto estilo selfie, perspectiva de primeira pessoa, ângulo de selfie, sem câmera visível. Final de tarde, interior de uma padaria em Santos, ambiente brasileiro, sem letreiros visíveis. Uma padeira, parda pele morena, Santos, roupa branca com avental, pose de herói olhando para câmera. Ao fundo, fornos e pães expostos.'`,
        ...(isBRollEnabled ? [
          `VIDEO EXEMPLO COM B-ROLL: 'Foto estilo selfie, perspectiva de primeira pessoa, ângulo de selfie, sem câmera visível. Com a câmera Selfie VLOG, próxima ao rosto. Câmera subjetiva, POV. Primeira cena: Meio-dia ensolarado, interior de um studio de tatuagem em Recife. Um tatuador, negro pele escura, Recife, roupa preta, acenando para câmera com a outra mão. Ao fundo, cadeiras de tatuagem e arte nas paredes. Corta para segunda cena: A mesma pessoa, com a mesma roupa preta, no momento seguinte, fazendo tatuagem no braço de cliente.'`
        ] : [
          `VIDEO EXEMPLO SEM B-ROLL: 'Foto estilo selfie, perspectiva de primeira pessoa, ângulo de selfie, sem câmera visível. Com a câmera Selfie VLOG, próxima ao rosto. Câmera subjetiva, POV. Meio-dia ensolarado, interior de um studio de tatuagem em Recife. Um tatuador, negro pele escura, Recife, roupa preta, acenando para câmera com a outra mão. Ao fundo, cadeiras de tatuagem e arte nas paredes.'`
        ]),
        "",
        ...(isBRollEnabled ? [
          "EXEMPLOS DE B-ROLL POR PROFISSÃO:",
          "- Tatuador: 'corta para a mesma pessoa, com a mesma roupa, no momento seguinte, fazendo tatuagem no braço de cliente'",
          "- Padeiro: 'corta para a mesma pessoa, com a mesma roupa, no momento seguinte, amassando massa de pão'",
          "- Mecânico: 'corta para a mesma pessoa, com a mesma roupa, no momento seguinte, consertando motor de carro'",
          "- Jardineiro: 'corta para a mesma pessoa, com a mesma roupa, no momento seguinte, aparando plantas em jardim público de [cidade]'",
          "- Construção: 'corta para a mesma pessoa, com a mesma roupa, no momento seguinte, operando equipamento em obra de [cidade]'",
          ""
        ] : []),
        "",
        "DADOS DO PERFIL PARA USAR:",
        `- Cidade: "${profile.city}" (usar exatamente esta cidade, sem região)`,
        `- CNAE/Negócio: "${profile.cnae}" (determinar tipo específico de negócio)`,
        `- Nome do proprietário: "${profile.ownerName}" (analisar para determinar gênero)`,
        `- Horário: "${randomTimeOfDay}" (usar este horário específico)`,
        `- Etnia: "${randomEthnicity}" (usar esta etnia específica)`,
        `- Ação idle: "${randomIdleAction}" (usar esta ação específica)`,
        `- Duração do vídeo: ${videoDuration} segundos (considerar para complexidade da ação)`,
        "",
        "INSTRUÇÕES FINAIS:",
        "- Use os dados do perfil acima para criar prompts únicos e específicos",
        "- Adapte os exemplos ao contexto real do negócio",
        "- Seja criativo mas mantenha realismo e coerência",
        "- Garanta que image_prompt e video_prompt sejam consistentes entre si",
        "",
        "RETORNE JSON com 'image_prompt', 'video_prompt', 'overlay_text' e 'button_text':",
        `- overlay_text: 2 linhas (máx 15 chars cada) promovendo "${profile.productCallout}" para o negócio ${profile.cnae}`,
        `- button_text: Call-to-action (máx 12 chars) relacionado a "${profile.productCallout}". Exemplos: 'Começar', 'Saber mais', 'Testar'`,
      ],
    };

    // Add custom notes to the rules if they exist
    const customNotes = customNotesDisplayEl.value.trim();
    if (customNotes) {
      user.rules.push("", `INSTRUÇÕES PERSONALIZADAS DO USUÁRIO: ${customNotes}`);
      console.log('📝 Added custom notes to prompt:', customNotes);
    }

    let json;
    
    // Check if user is authenticated with Supabase (use Edge Functions)
    if (window.cloudwalkAuth?.isAuthenticated && window.cloudwalkAuth?.user?.accessToken && window.supabaseConfig) {
      console.log('🔄 Using Supabase Edge Function for OpenAI API call');
      
      try {
        const authToken = await window.cloudwalkAuth.getAuthToken();
        if (!authToken) {
          throw new Error('Failed to get authentication token');
        }

        const response = await fetch(`${window.supabaseConfig.functions.openai}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are a JSON generator. Always respond with valid JSON only, no explanations or extra text.'
              },
              {
                role: 'user', 
                content: user.rules.join('\n') + '\n\nRETURNE APENAS JSON VÁLIDO:'
              }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('🚨 Supabase Edge Function error:', response.status, errorText);
          throw new Error(`Supabase Edge Function failed: ${response.status}`);
        }

        const openaiResponse = await response.json();
        console.log('✅ OpenAI response via Supabase Edge Function received');
        console.log('🔍 Full OpenAI response:', JSON.stringify(openaiResponse, null, 2));
        
        // Parse the actual content from OpenAI response
        try {
          const content = openaiResponse.choices[0].message.content;
          console.log('🔍 OpenAI content to parse:', content);
          json = JSON.parse(content);
          console.log('🔍 Parsed JSON from content:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.error('❌ Failed to parse OpenAI content:', e);
          throw new Error(`Failed to parse OpenAI response: ${e.message}`);
        }
        
      } catch (error) {
        console.error('🚨 Supabase Edge Function call failed:', error);
        throw error;
      }
      
    } else {
      // Use serverless function (Vercel/local)
      const endpoint = `${API_BASE}/gpt/prompts`;
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profile })
      });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(`Prompt generation error: ${t}`);
      }
      json = await r.json();
    }

    // Let LLM determine gender and profession - much smarter than hardcoded regex

    // Trust the LLM to generate both prompts based on the comprehensive instructions
    
    // Add default overlay and button text if not provided
    console.log('🔍 Checking overlay/button text from OpenAI:');
    console.log('  - overlay_text:', json.overlay_text);
    console.log('  - button_text:', json.button_text);
    
    if (!json.overlay_text) {
      console.log('⚠️ No overlay_text from OpenAI, using fallback');
      const productCallout = profile.productCallout || "Gestão digital";
      const productLines = productCallout.split(' ');
      if (productLines.length >= 2) {
        json.overlay_text = `${productLines[0]}\n${productLines.slice(1).join(' ')}`;
      } else {
        json.overlay_text = `${productCallout}\nAqui`;
      }
    }
    if (!json.button_text) {
      console.log('⚠️ No button_text from OpenAI, using fallback');
      json.button_text = "Começar";
    }
    
    console.log('🎯 Final overlay/button text to be used:');
    console.log('  - overlay_text:', json.overlay_text);
    console.log('  - button_text:', json.button_text);
    

    
    // Debug log to see what OpenAI returned
    console.log('OpenAI response processed successfully');
    return json;
  } catch (e) {
    console.error(e);
    alert(`OpenAI prompt generation failed: ${e?.message || e}`);
    return null;
  }
}

async function generateImage(imagePrompt) {
  try {
    const finalPrompt = imagePrompt; // Use the generated Portuguese prompt directly
    
    // Prompt is already displayed by displayPrompts() function
    
    const imageSeed = generateSeedVariation(window.currentMasterSeed || generateBetterRandomSeed(), 1);
    console.log(`🎨 Image Seed: ${imageSeed} (Master: ${window.currentMasterSeed})`);
    
    const body = {
      input: {
        prompt: finalPrompt,
        aspect_ratio: "16:9",
        size: "regular",
        guidance_scale: 5.0,
        seed: imageSeed
      }
    };
         // Status is already set by caller function
     
         let imageUrl;
    
    // Check if user is authenticated with Supabase (use Edge Functions)
    if (window.cloudwalkAuth?.isAuthenticated && window.cloudwalkAuth?.user?.accessToken && window.supabaseConfig) {
      console.log('🔄 Using Supabase Edge Function for Replicate Image API call');
      
      try {
        const authToken = await window.cloudwalkAuth.getAuthToken();
        if (!authToken) {
          throw new Error('Failed to get authentication token');
        }

        const imageSeed = generateSeedVariation(window.currentMasterSeed || generateBetterRandomSeed(), 1);
        console.log(`🖼️ Image Seed: ${imageSeed} (Master: ${window.currentMasterSeed})`);

        const body = {
          model: 'bytedance/seedream-3',
          input: {
            prompt: finalPrompt,
            guidance_scale: 2.5,
            seed: imageSeed,
            width: 1000,
            height: 1000,
            num_outputs: 1
          }
        };

        console.log('Image request body via Supabase:', JSON.stringify(body, null, 2));

        const response = await fetch(`${window.supabaseConfig.functions.replicate}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        // Log response details for debugging
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('📊 Response content-type:', response.headers.get('content-type'));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('🚨 Supabase Replicate Edge Function error:', response.status, errorText);
          throw new Error(`Supabase Replicate Edge Function failed: ${response.status}`);
        }

        // Check content type before parsing JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textContent = await response.text();
          console.error('❌ Unexpected content type:', contentType);
          console.error('❌ Response body:', textContent);
          throw new Error(`Expected JSON response, got: ${contentType}`);
        }

        const result = await response.json();
        console.log('✅ Replicate response via Supabase Edge Function received');
        console.log('🔍 Full Replicate result:', JSON.stringify(result, null, 2));
        console.log('🔍 Result status:', result.status);
        console.log('🔍 Result output type:', typeof result.output);
        console.log('🔍 Result output:', result.output);
        
        // Handle different possible response formats
        let extractedUrl = null;
        
        if (result.output) {
          if (Array.isArray(result.output) && result.output.length > 0) {
            extractedUrl = result.output[0];
            console.log('📸 Image URL extracted from array:', extractedUrl);
          } else if (typeof result.output === 'string') {
            extractedUrl = result.output;
            console.log('📸 Image URL extracted as string:', extractedUrl);
          } else {
            console.error('❌ Unexpected output format:', typeof result.output, result.output);
          }
        }
        
        // Validate URL before using it
        if (extractedUrl) {
          try {
            const urlObj = new URL(extractedUrl);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
              imageUrl = extractedUrl;
              console.log('✅ Valid image URL confirmed:', imageUrl);
            } else {
              console.error('❌ Invalid URL protocol:', urlObj.protocol);
              throw new Error(`Invalid URL protocol: ${urlObj.protocol}`);
            }
          } catch (urlError) {
            console.error('❌ Invalid URL format:', extractedUrl, urlError);
            throw new Error(`Invalid URL format: ${extractedUrl}`);
          }
        } else {
          console.error('❌ No valid URL found in result:', result);
          throw new Error('No image URL in response');
        }
        
      } catch (error) {
        console.error('🚨 Supabase Replicate Edge Function call failed:', error);
        throw error;
      }
      
    } else {
       // Use serverless function (Vercel/local)
       const endpoint = `${API_BASE}/replicate/image`;
       const r = await fetch(endpoint, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ prompt: finalPrompt })
       });
       if (!r.ok) throw new Error(await r.text());
       const j = await r.json();
       imageUrl = j.url;
     }
    if (imageUrl) {
      console.log('🖼️ Creating image element with URL:', imageUrl);
      
      // Double-check URL validity before using it
      try {
        new URL(imageUrl);
        console.log('✅ URL validation passed for DOM update');
      } catch (e) {
        console.error('❌ URL validation failed for DOM update:', imageUrl, e);
        imageStatus.textContent = "Invalid image URL received.";
        return null;
      }
      
      const img = document.createElement("img");
      img.src = imageUrl;
      img.onload = () => console.log('✅ Image loaded successfully');
      img.onerror = (e) => console.error('❌ Image load failed:', e, 'URL:', imageUrl);
      
      imageContainer.innerHTML = "";
      imageContainer.appendChild(img);
      const a = document.createElement("a");
      a.href = imageUrl; a.download = "image.png"; a.textContent = "📥 Download";
      a.className = "download-btn";
      imageContainer.appendChild(a);
      imageStatus.textContent = "Done.";
      
      // Update start frame feedback now that image is available  
      updateStartFrameVisualFeedback();
      
      // Update preview if showing image
      updatePreviewMode();
    } else {
      console.error('❌ No imageUrl to display');
      imageStatus.textContent = "Image generation failed.";
    }
    return imageUrl;
  } catch (e) {
    console.error(e);
    imageStatus.textContent = "Image generation failed.";
    return null;
  }
}



async function generateSeededit(imageUrl) {
  try {
    console.log('🔧 Starting text removal process with imageUrl:', imageUrl);
    if (!imageUrl) {
      console.log('❌ No image URL provided for text removal');
      if (seededitStatus) seededitStatus.textContent = "No image to process.";
      return null;
    }

    let editedImageUrl;
    
    // Check if user is authenticated with Supabase (use Edge Functions)
    if (window.cloudwalkAuth?.isAuthenticated && window.cloudwalkAuth?.user?.accessToken && window.supabaseConfig) {
      console.log('🔄 Using Supabase Edge Function for Replicate Seededit API call');
      
      try {
        const authToken = await window.cloudwalkAuth.getAuthToken();
        if (!authToken) {
          throw new Error('Failed to get authentication token');
        }

        const seededitSeed = generateSeedVariation(window.currentMasterSeed || generateBetterRandomSeed(), 2);
        console.log(`🔧 Seededit Seed: ${seededitSeed} (Master: ${window.currentMasterSeed})`);

        const body = {
          model: 'bytedance/seededit-3.0',
          input: {
            image: imageUrl,
            prompt: "remove text from image, remove name of the shop, remove letterings, remove subtitle, remove storefront name, remove text, remove all written, remove every text",
            guidance_scale: 5.5,
            seed: seededitSeed
          }
        };

        console.log('Seededit request body via Supabase:', JSON.stringify(body, null, 2));

        const response = await fetch(`${window.supabaseConfig.functions.replicate}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('🚨 Supabase Replicate Seededit Edge Function error:', response.status, errorText);
          throw new Error(`Supabase Replicate Seededit Edge Function failed: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Replicate Seededit response via Supabase Edge Function received');
        console.log('🔍 Full Seededit result:', JSON.stringify(result, null, 2));
        console.log('🔍 Seededit result status:', result.status);
        console.log('🔍 Seededit result output type:', typeof result.output);
        console.log('🔍 Seededit result output:', result.output);
        
        // Handle different possible response formats
        let extractedUrl = null;
        
        if (result.output) {
          if (Array.isArray(result.output) && result.output.length > 0) {
            extractedUrl = result.output[0];
            console.log('🖼️ Seededit URL extracted from array:', extractedUrl);
          } else if (typeof result.output === 'string') {
            extractedUrl = result.output;
            console.log('🖼️ Seededit URL extracted as string:', extractedUrl);
          } else {
            console.error('❌ Unexpected seededit output format:', typeof result.output, result.output);
          }
        }
        
        // Validate URL before using it
        if (extractedUrl) {
          try {
            const urlObj = new URL(extractedUrl);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
              editedImageUrl = extractedUrl;
              console.log('✅ Valid seededit URL confirmed:', editedImageUrl);
            } else {
              console.error('❌ Invalid seededit URL protocol:', urlObj.protocol);
              throw new Error(`Invalid seededit URL protocol: ${urlObj.protocol}`);
            }
          } catch (urlError) {
            console.error('❌ Invalid seededit URL format:', extractedUrl, urlError);
            throw new Error(`Invalid seededit URL format: ${extractedUrl}`);
          }
        } else {
          console.error('❌ No valid seededit URL found in result:', result);
          throw new Error('No edited image URL in response');
        }
        
      } catch (error) {
        console.error('🚨 Supabase Replicate Seededit Edge Function call failed:', error);
        throw error;
      }
      
    } else {
      // Use serverless function (Vercel/local)
      const endpoint = `${API_BASE}/replicate/seededit`;
      const requestBody = { imageUrl: imageUrl };
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (!r.ok) throw new Error(await r.text());
      const j = await r.json();
      editedImageUrl = j.url;
    }
    
    console.log('🔧 Text removal completed. EditedImageUrl:', editedImageUrl);
    console.log('🔧 SeededitContainer exists:', !!seededitContainer);
    
    if (editedImageUrl && seededitContainer) {
      console.log('✅ Creating text-removed image element');
      const img = document.createElement("img");
      img.src = editedImageUrl;
      img.onload = () => {
        console.log('✅ Text-removed image loaded successfully');
      };
      img.onerror = (e) => {
        console.error('❌ Text-removed image loading error:', e);
        console.error('❌ Failed image URL:', editedImageUrl);
      };
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.maxHeight = '400px';
      img.style.objectFit = 'contain';
      
      seededitContainer.innerHTML = "";
      seededitContainer.appendChild(img);
      
      const a = document.createElement("a");
      a.href = editedImageUrl; 
      a.download = "text-removed-image.png"; 
      a.textContent = "📥 Download";
      a.className = "download-btn";
      seededitContainer.appendChild(a);
      
      if (seededitStatus) seededitStatus.textContent = "Done.";
      
      // Update start frame feedback since edited image is now available
      updateStartFrameVisualFeedback();
      
      // Update preview if showing image
      console.log('🔄 Updating preview mode after text removal');
      updatePreviewMode();
    } else {
      console.log('❌ Text removal failed - editedImageUrl:', editedImageUrl, 'seededitContainer:', !!seededitContainer);
      if (seededitStatus) seededitStatus.textContent = "Text removal failed.";
    }
    return editedImageUrl;
  } catch (e) {
    console.error(e);
    if (seededitStatus) seededitStatus.textContent = "Text removal failed.";
    return null;
  }
}

async function generateSeedanceVideo(videoPrompt, startFrameUrl = null) {
  try {
    // Prompt is already displayed by displayPrompts() function
         // Status is already set by caller function
     
         let videoUrl;
    
    // Check if user is authenticated with Supabase (use Edge Functions)
    if (window.cloudwalkAuth?.isAuthenticated && window.cloudwalkAuth?.user?.accessToken && window.supabaseConfig) {
      console.log('🔄 Using Supabase Edge Function for Replicate Video API call');
      
      try {
        const authToken = await window.cloudwalkAuth.getAuthToken();
        if (!authToken) {
          throw new Error('Failed to get authentication token');
        }

        const videoSeed = generateSeedVariation(window.currentMasterSeed || generateBetterRandomSeed(), 3);
        console.log(`🎬 Video Seed: ${videoSeed} (Master: ${window.currentMasterSeed})`);

        const videoDuration = (videoDuration10sEl && videoDuration10sEl.checked) ? 10 : 5;
        console.log(`🎬 Video Duration: ${videoDuration} seconds`);

        const body = {
          model: 'bytedance/seedance-1-lite',
          input: {
            prompt: videoPrompt,
            duration: videoDuration,
            resolution: "480p",
            aspect_ratio: "16:9",
            fps: 24,
            camera_fixed: false,
            seed: videoSeed
          }
        };

        // Add start frame if provided
        if (startFrameUrl) {
          body.input.image = startFrameUrl;
          console.log('🖼️ START FRAME ADDED to video request:', startFrameUrl.substring(0, 50) + '...');
        } else {
          console.log('⚠️ NO START FRAME - proceeding without start frame');
        }

        console.log('Video request body via Supabase:', JSON.stringify(body, null, 2));

        const response = await fetch(`${window.supabaseConfig.functions.replicate}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('🚨 Supabase Replicate Video Edge Function error:', response.status, errorText);
          throw new Error(`Supabase Replicate Video Edge Function failed: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Replicate Video response via Supabase Edge Function received');
        console.log('🔍 Full Video result:', JSON.stringify(result, null, 2));
        console.log('🔍 Video result status:', result.status);
        console.log('🔍 Video result output type:', typeof result.output);
        console.log('🔍 Video result output:', result.output);
        
        // Handle different possible response formats
        let extractedUrl = null;
        
        if (result.output) {
          if (Array.isArray(result.output) && result.output.length > 0) {
            extractedUrl = result.output[0];
            console.log('🎬 Video URL extracted from array:', extractedUrl);
          } else if (typeof result.output === 'string') {
            extractedUrl = result.output;
            console.log('🎬 Video URL extracted as string:', extractedUrl);
          } else {
            console.error('❌ Unexpected video output format:', typeof result.output, result.output);
          }
        }
        
        // Validate URL before using it
        if (extractedUrl) {
          try {
            const urlObj = new URL(extractedUrl);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
              videoUrl = extractedUrl;
              console.log('✅ Valid video URL confirmed:', videoUrl);
            } else {
              console.error('❌ Invalid video URL protocol:', urlObj.protocol);
              throw new Error(`Invalid video URL protocol: ${urlObj.protocol}`);
            }
          } catch (urlError) {
            console.error('❌ Invalid video URL format:', extractedUrl, urlError);
            throw new Error(`Invalid video URL format: ${extractedUrl}`);
          }
        } else {
          console.error('❌ No valid video URL found in result:', result);
          throw new Error('No video URL in response');
        }
        
      } catch (error) {
        console.error('🚨 Supabase Replicate Video Edge Function call failed:', error);
        throw error;
      }
      
    } else {
       // Use serverless function (Vercel/local)
       const endpoint = `${API_BASE}/replicate/seedance`;
       const videoDuration = (videoDuration10sEl && videoDuration10sEl.checked) ? 10 : 5;
       console.log(`🎬 Video Duration (serverless): ${videoDuration} seconds`);
       
       const requestBody = { 
         prompt: videoPrompt,
         duration: videoDuration,
         resolution: "480p",
         aspect_ratio: "16:9",
         fps: 24,
         camera_fixed: false
       };
       if (startFrameUrl) {
         requestBody.image = startFrameUrl;
         console.log('🖼️ Using start frame for serverless:', startFrameUrl);
       }
       const r = await fetch(endpoint, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(requestBody)
       });
       if (!r.ok) throw new Error(await r.text());
       const j = await r.json();
       videoUrl = j.url;
     }
    if (videoUrl && seedanceContainer) {
      console.log('🎬 Creating video element with URL:', videoUrl);
      const video = document.createElement("video");
      video.controls = true;
      video.muted = true; // Seedance videos don't have audio
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        console.log('✅ Video metadata loaded successfully');
      };
      video.onerror = (e) => {
        console.error('❌ Video loading error:', e);
      };
      seedanceContainer.innerHTML = "";
      seedanceContainer.appendChild(video);
      const a = document.createElement("a");
      a.href = videoUrl; a.download = "seedance-video.mp4"; a.textContent = "📥 Download";
      a.className = "download-btn";
      seedanceContainer.appendChild(a);
      
      // Update preview based on current mode
      console.log('🔄 Updating preview mode after video creation');
      updatePreviewMode();
      
      if (seedanceStatus) seedanceStatus.textContent = "Done.";
    } else {
      console.log('❌ Video generation failed - videoUrl:', videoUrl, 'seedanceContainer:', !!seedanceContainer);
      if (seedanceStatus) seedanceStatus.textContent = "Seedance video generation failed.";
    }
    return videoUrl;
  } catch (e) {
    console.error(e);
    if (seedanceStatus) seedanceStatus.textContent = "Seedance video generation failed.";
    return null;
  }
}

// Polling function removed - handled server-side


