/**
 * WebPage Chatter - Settings Script
 */

// DOM Elements
const apiKeyInput = document.getElementById('api-key-input');
const toggleApiKeyBtn = document.getElementById('toggle-api-key');
const ttsVoiceSelect = document.getElementById('tts-voice-select');
const ttsSpeedRange = document.getElementById('tts-speed-range');
const ttsPitchRange = document.getElementById('tts-pitch-range');
const ttsSpeedValue = document.getElementById('tts-speed-value');
const ttsPitchValue = document.getElementById('tts-pitch-value');
const autoSaveChats = document.getElementById('auto-save-chats');
const clearChatsBtn = document.getElementById('clear-chats-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const resetSettingsBtn = document.getElementById('reset-settings-btn');
const toast = document.getElementById('toast');

// Default settings
const DEFAULT_SETTINGS = {
    ttsSpeed: 1.0,
    ttsPitch: 1.0,
    autoSaveChats: true
};

// Global variables
let voices = [];

// Initialize settings page
document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
});

/**
 * Initialize the settings page
 */
async function initializeSettings() {
    // Load settings
    await loadSettings();
    
    // Initialize TTS voices
    initializeTTS();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Load user settings from storage
 */
async function loadSettings() {
    try {
        const settings = await StorageService.getSettings([
            'geminiApiKey',
            'ttsVoiceURI',
            'ttsSpeed',
            'ttsPitch',
            'autoSaveChats'
        ]);
        
        // Update settings UI
        apiKeyInput.value = settings.geminiApiKey || '';
        ttsSpeedRange.value = settings.ttsSpeed || DEFAULT_SETTINGS.ttsSpeed;
        ttsPitchRange.value = settings.ttsPitch || DEFAULT_SETTINGS.ttsPitch;
        ttsSpeedValue.textContent = settings.ttsSpeed || DEFAULT_SETTINGS.ttsSpeed;
        ttsPitchValue.textContent = settings.ttsPitch || DEFAULT_SETTINGS.ttsPitch;
        autoSaveChats.checked = settings.autoSaveChats !== false;
        
        console.log('Settings loaded');
    } catch (error) {
        console.error('Error loading settings:', error);
        showToast('Error loading settings. Please try again.');
    }
}

/**
 * Initialize Text-to-Speech
 */
function initializeTTS() {
    // Get available voices
    voices = window.speechSynthesis.getVoices();
    
    // If voices are not available yet, wait for them to load
    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            populateVoiceSelect();
        };
    } else {
        populateVoiceSelect();
    }
}

/**
 * Populate voice selection dropdown
 */
async function populateVoiceSelect() {
    // Clear existing options
    ttsVoiceSelect.innerHTML = '';
    
    // Get saved voice URI
    const settings = await StorageService.getSettings(['ttsVoiceURI']);
    const savedVoiceURI = settings.ttsVoiceURI;
    
    // Add each voice as an option
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.voiceURI;
        option.textContent = `${voice.name} (${voice.lang})`;
        
        // Set as selected if it matches the saved voice
        if (savedVoiceURI === voice.voiceURI) {
            option.selected = true;
        }
        
        ttsVoiceSelect.appendChild(option);
    });
    
    // If no voice is selected, select the first one
    if (!ttsVoiceSelect.value && voices.length > 0) {
        ttsVoiceSelect.value = voices[0].voiceURI;
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Toggle API key visibility
    toggleApiKeyBtn.addEventListener('click', () => {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleApiKeyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            apiKeyInput.type = 'password';
            toggleApiKeyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });
    
    // TTS range inputs
    ttsSpeedRange.addEventListener('input', () => {
        ttsSpeedValue.textContent = ttsSpeedRange.value;
    });
    ttsPitchRange.addEventListener('input', () => {
        ttsPitchValue.textContent = ttsPitchRange.value;
    });
    
    // Save settings
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // Reset settings
    resetSettingsBtn.addEventListener('click', resetSettings);
    
    // Clear chats
    clearChatsBtn.addEventListener('click', clearAllChats);
}

/**
 * Save settings
 */
async function saveSettings() {
    try {
        const newSettings = {
            geminiApiKey: apiKeyInput.value.trim(),
            ttsVoiceURI: ttsVoiceSelect.value,
            ttsSpeed: parseFloat(ttsSpeedRange.value),
            ttsPitch: parseFloat(ttsPitchRange.value),
            autoSaveChats: autoSaveChats.checked
        };
        
        await StorageService.saveSettings(newSettings);
        showToast('Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Error saving settings. Please try again.');
    }
}

/**
 * Reset settings to defaults
 */
async function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults? This will not clear your API key or saved chats.')) {
        try {
            // Get current API key
            const settings = await StorageService.getSettings(['geminiApiKey']);
            const apiKey = settings.geminiApiKey;
            
            // Reset to defaults but keep API key
            const newSettings = {
                ...DEFAULT_SETTINGS,
                geminiApiKey: apiKey
            };
            
            // If there are voices, set the first one as default
            if (voices.length > 0) {
                newSettings.ttsVoiceURI = voices[0].voiceURI;
            }
            
            await StorageService.saveSettings(newSettings);
            
            // Update UI
            ttsSpeedRange.value = DEFAULT_SETTINGS.ttsSpeed;
            ttsPitchRange.value = DEFAULT_SETTINGS.ttsPitch;
            ttsSpeedValue.textContent = DEFAULT_SETTINGS.ttsSpeed;
            ttsPitchValue.textContent = DEFAULT_SETTINGS.ttsPitch;
            autoSaveChats.checked = DEFAULT_SETTINGS.autoSaveChats;
            
            if (voices.length > 0) {
                ttsVoiceSelect.value = voices[0].voiceURI;
            }
            
            showToast('Settings reset to defaults');
        } catch (error) {
            console.error('Error resetting settings:', error);
            showToast('Error resetting settings. Please try again.');
        }
    }
}

/**
 * Clear all saved chats
 */
async function clearAllChats() {
    if (confirm('Are you sure you want to clear all saved chats? This cannot be undone.')) {
        try {
            await StorageService.clearAllChats();
            showToast('All saved chats cleared');
        } catch (error) {
            console.error('Error clearing chats:', error);
            showToast('Error clearing chats. Please try again.');
        }
    }
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}
