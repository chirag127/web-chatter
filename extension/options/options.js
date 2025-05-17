// Options page script for Contextual Web Page Chat Assistant

// DOM Elements
const geminiApiKeyInput = document.getElementById('gemini-api-key');
const backendUrlInput = document.getElementById('backend-url');
const saveApiKeyBtn = document.getElementById('save-api-key');
const ttsVoiceSelect = document.getElementById('tts-voice');
const ttsRateInput = document.getElementById('tts-rate');
const rateValueSpan = document.getElementById('rate-value');
const testTtsBtn = document.getElementById('test-tts');
const saveTtsBtn = document.getElementById('save-tts');
const statusMessage = document.getElementById('status-message');

// State
let voices = [];
let currentUtterance = null;

// Initialize
document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  // Load saved settings
  loadSettings();
  
  // Set up event listeners
  saveApiKeyBtn.addEventListener('click', saveApiSettings);
  ttsRateInput.addEventListener('input', updateRateValue);
  testTtsBtn.addEventListener('click', testTts);
  saveTtsBtn.addEventListener('click', saveTtsSettings);
  
  // Initialize TTS voices
  initTtsVoices();
}

// Function to load saved settings
function loadSettings() {
  chrome.storage.sync.get(['geminiApiKey', 'backendUrl', 'ttsVoice', 'ttsRate'], result => {
    // Load API key (show masked version)
    if (result.geminiApiKey) {
      geminiApiKeyInput.value = '•'.repeat(16);
      geminiApiKeyInput.dataset.hasKey = 'true';
    }
    
    // Load backend URL
    if (result.backendUrl) {
      backendUrlInput.value = result.backendUrl;
    }
    
    // Load TTS settings
    if (result.ttsRate) {
      const rate = parseFloat(result.ttsRate);
      ttsRateInput.value = rate;
      rateValueSpan.textContent = rate.toFixed(1);
    }
    
    // TTS voice is loaded after voices are available
  });
}

// Function to initialize TTS voices
function initTtsVoices() {
  // Check if speechSynthesis is available
  if (!('speechSynthesis' in window)) {
    ttsVoiceSelect.innerHTML = '<option value="">Text-to-speech not supported in this browser</option>';
    ttsVoiceSelect.disabled = true;
    testTtsBtn.disabled = true;
    return;
  }
  
  // Function to populate voices
  function populateVoices() {
    voices = speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      ttsVoiceSelect.innerHTML = '<option value="">No voices available</option>';
      return;
    }
    
    // Sort voices by language and name
    voices.sort((a, b) => {
      if (a.lang !== b.lang) {
        return a.lang.localeCompare(b.lang);
      }
      return a.name.localeCompare(b.name);
    });
    
    // Create options
    let options = '';
    let currentLang = '';
    
    voices.forEach(voice => {
      // Add language group
      if (voice.lang !== currentLang) {
        if (currentLang !== '') {
          options += '</optgroup>';
        }
        currentLang = voice.lang;
        options += `<optgroup label="${voice.lang}">`;
      }
      
      options += `<option value="${voice.name}">${voice.name}${voice.default ? ' (Default)' : ''}</option>`;
    });
    
    if (currentLang !== '') {
      options += '</optgroup>';
    }
    
    ttsVoiceSelect.innerHTML = options;
    
    // Set selected voice from storage
    chrome.storage.sync.get(['ttsVoice'], result => {
      if (result.ttsVoice) {
        ttsVoiceSelect.value = result.ttsVoice;
        
        // If the saved voice doesn't exist anymore, select the default
        if (ttsVoiceSelect.value !== result.ttsVoice) {
          const defaultVoice = voices.find(voice => voice.default);
          if (defaultVoice) {
            ttsVoiceSelect.value = defaultVoice.name;
          }
        }
      } else {
        // Select default voice
        const defaultVoice = voices.find(voice => voice.default);
        if (defaultVoice) {
          ttsVoiceSelect.value = defaultVoice.name;
        }
      }
    });
  }
  
  // Chrome loads voices asynchronously
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
  
  // Try to load voices immediately (works in Firefox)
  populateVoices();
}

// Function to update rate value display
function updateRateValue() {
  const rate = parseFloat(ttsRateInput.value);
  rateValueSpan.textContent = rate.toFixed(1);
}

// Function to test TTS
function testTts() {
  if (!('speechSynthesis' in window)) {
    showStatus('Text-to-speech is not supported in this browser', 'error');
    return;
  }
  
  // Cancel any ongoing speech
  if (currentUtterance) {
    speechSynthesis.cancel();
  }
  
  // Create test utterance
  const utterance = new SpeechSynthesisUtterance('This is a test of the selected voice and speech rate.');
  
  // Set voice
  const selectedVoice = ttsVoiceSelect.value;
  if (selectedVoice) {
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
  }
  
  // Set rate
  utterance.rate = parseFloat(ttsRateInput.value);
  
  // Speak
  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
  
  // Clear current utterance when done
  utterance.onend = () => {
    currentUtterance = null;
  };
}

// Function to save API settings
function saveApiSettings() {
  const apiKey = geminiApiKeyInput.value;
  const backendUrl = backendUrlInput.value.trim();
  
  // Validate inputs
  if (!apiKey || apiKey === '•'.repeat(16) && !geminiApiKeyInput.dataset.hasKey) {
    showStatus('Please enter a Gemini API key', 'error');
    return;
  }
  
  if (!backendUrl) {
    showStatus('Please enter a backend URL', 'error');
    return;
  }
  
  // Validate URL format
  try {
    new URL(backendUrl);
  } catch (e) {
    showStatus('Please enter a valid URL', 'error');
    return;
  }
  
  // Save settings
  const settings = {
    backendUrl
  };
  
  // Only update API key if it's not the masked version
  if (apiKey !== '•'.repeat(16)) {
    settings.geminiApiKey = apiKey;
  }
  
  chrome.storage.sync.set(settings, () => {
    showStatus('API settings saved successfully', 'success');
    
    // Update input to show masked version
    geminiApiKeyInput.value = '•'.repeat(16);
    geminiApiKeyInput.dataset.hasKey = 'true';
  });
}

// Function to save TTS settings
function saveTtsSettings() {
  const ttsVoice = ttsVoiceSelect.value;
  const ttsRate = ttsRateInput.value;
  
  chrome.storage.sync.set({
    ttsVoice,
    ttsRate
  }, () => {
    showStatus('TTS settings saved successfully', 'success');
  });
}

// Function to show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type === 'success' ? 'status-success' : 'status-error';
  statusMessage.classList.remove('hidden');
  
  // Hide after 3 seconds
  setTimeout(() => {
    statusMessage.classList.add('fade-out');
    setTimeout(() => {
      statusMessage.classList.add('hidden');
      statusMessage.classList.remove('fade-out');
    }, 300);
  }, 3000);
}
