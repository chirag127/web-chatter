// Options page script for Web Chatter extension

// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const toggleApiKeyBtn = document.getElementById('toggleApiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const ttsVoiceSelect = document.getElementById('ttsVoice');
const ttsSpeedInput = document.getElementById('ttsSpeed');
const speedValueSpan = document.getElementById('speedValue');
const testTtsBtn = document.getElementById('testTts');
const saveTtsSettingsBtn = document.getElementById('saveTtsSettings');
const statusMessage = document.getElementById('statusMessage');

// Initialize
document.addEventListener('DOMContentLoaded', initialize);

// Event Listeners
toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);
saveApiKeyBtn.addEventListener('click', saveApiKey);
ttsSpeedInput.addEventListener('input', updateSpeedValue);
testTtsBtn.addEventListener('click', testTtsVoice);
saveTtsSettingsBtn.addEventListener('click', saveTtsSettings);

// Initialize the options page
async function initialize() {
  // Load saved settings
  loadSavedSettings();

  // Load available voices
  loadVoices();

  // If speechSynthesis.onvoiceschanged is supported, use it
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
}

// Load saved settings from storage
async function loadSavedSettings() {
  try {
    const settings = await chrome.storage.sync.get(['geminiApiKey', 'ttsVoice', 'ttsSpeed']);

    // Set API key if it exists
    if (settings.geminiApiKey) {
      apiKeyInput.value = settings.geminiApiKey;
    }

    // Set TTS voice if it exists
    if (settings.ttsVoice) {
      // We'll set this after voices are loaded
      setTimeout(() => {
        if (ttsVoiceSelect.querySelector(`option[value="${settings.ttsVoice}"]`)) {
          ttsVoiceSelect.value = settings.ttsVoice;
        }
      }, 500);
    }

    // Set TTS speed if it exists
    if (settings.ttsSpeed) {
      const speed = parseFloat(settings.ttsSpeed);
      ttsSpeedInput.value = speed;
      speedValueSpan.textContent = `${speed.toFixed(1)}x`;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings', 'error');
  }
}

// Load available voices for TTS
function loadVoices() {
  // Get available voices
  const voices = speechSynthesis.getVoices();

  // Clear existing options
  ttsVoiceSelect.innerHTML = '';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Default Voice';
  ttsVoiceSelect.appendChild(defaultOption);

  // Add available voices
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    ttsVoiceSelect.appendChild(option);
  });

  // Try to set previously selected voice
  chrome.storage.sync.get(['ttsVoice'], (result) => {
    if (result.ttsVoice) {
      if (ttsVoiceSelect.querySelector(`option[value="${result.ttsVoice}"]`)) {
        ttsVoiceSelect.value = result.ttsVoice;
      }
    }
  });
}

// Toggle API key visibility
function toggleApiKeyVisibility() {
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleApiKeyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
      </svg>
    `;
  } else {
    apiKeyInput.type = 'password';
    toggleApiKeyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
      </svg>
    `;
  }
}

// Save API key
async function saveApiKey() {
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    showStatus('Please enter a valid API key', 'error');
    return;
  }

  try {
    await chrome.storage.sync.set({ geminiApiKey: apiKey });
    showStatus('API key saved successfully', 'success');
  } catch (error) {
    console.error('Error saving API key:', error);
    showStatus('Error saving API key', 'error');
  }
}

// Update speed value display
function updateSpeedValue() {
  const speed = parseFloat(ttsSpeedInput.value);
  speedValueSpan.textContent = `${speed.toFixed(1)}x`;
}

// Test TTS voice
function testTtsVoice() {
  const selectedVoice = ttsVoiceSelect.value;
  const speed = parseFloat(ttsSpeedInput.value);
  const testText = 'This is a test of the Web Chatter text-to-speech feature.';

  // Stop any current speech
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(testText);

  // Set voice if selected
  if (selectedVoice) {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
  }

  // Set speed
  utterance.rate = speed;

  // Speak
  speechSynthesis.speak(utterance);
}

// Save TTS settings
async function saveTtsSettings() {
  const voice = ttsVoiceSelect.value;
  const speed = parseFloat(ttsSpeedInput.value);

  try {
    await chrome.storage.sync.set({
      ttsVoice: voice,
      ttsSpeed: speed
    });
    showStatus('TTS settings saved successfully', 'success');
  } catch (error) {
    console.error('Error saving TTS settings:', error);
    showStatus('Error saving TTS settings', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = 'p-4 rounded-md mb-4';

  if (type === 'success') {
    statusMessage.classList.add('bg-green-100', 'text-green-800');
  } else if (type === 'error') {
    statusMessage.classList.add('bg-red-100', 'text-red-800');
  } else {
    statusMessage.classList.add('bg-blue-100', 'text-blue-800');
  }

  statusMessage.classList.remove('hidden');

  // Hide after 3 seconds
  setTimeout(() => {
    statusMessage.classList.add('hidden');
  }, 3000);
}