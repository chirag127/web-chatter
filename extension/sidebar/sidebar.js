/**
 * WebPage Chatter - Sidebar Script
 * Handles sidebar UI, chat, TTS, and settings
 */

// Constants
const BACKEND_URL = 'https://webpage-chatter-backend.uc.r.appspot.com'; // Replace with your actual backend URL

// DOM Elements
const chatTab = document.getElementById('chat-tab');
const savedTab = document.getElementById('saved-tab');
const chatTabBtn = document.getElementById('chat-tab-btn');
const savedTabBtn = document.getElementById('saved-tab-btn');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const refreshContentBtn = document.getElementById('refresh-content-btn');
const settingsBtn = document.getElementById('settings-btn');
const closeBtn = document.getElementById('close-btn');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key-input');
const ttsVoiceSelect = document.getElementById('tts-voice-select');
const ttsSpeedRange = document.getElementById('tts-speed-range');
const ttsPitchRange = document.getElementById('tts-pitch-range');
const ttsSpeedValue = document.getElementById('tts-speed-value');
const ttsPitchValue = document.getElementById('tts-pitch-value');
const autoSaveChats = document.getElementById('auto-save-chats');
const clearChatsBtn = document.getElementById('clear-chats-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
const openSettingsBtn = document.getElementById('open-settings-btn');
const savedChatsList = document.getElementById('saved-chats-list');
const loadingIndicator = document.getElementById('loading-indicator');
const apiKeyMissing = document.getElementById('api-key-missing');
const minimalContent = document.getElementById('minimal-content');

// Global variables
let pageContent = '';
let pageMetadata = {};
let settings = {};
let currentSpeech = null;
let voices = [];
let currentStreamController = null;

// Initialize sidebar
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
});

/**
 * Initialize the sidebar
 */
async function initializeSidebar() {
    // Load settings
    await loadSettings();
    
    // Initialize TTS voices
    initializeTTS();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if API key is set
    checkApiKey();
    
    // Load saved chats
    loadSavedChats();
    
    // Extract page content
    await extractPageContent();
}

/**
 * Load user settings from storage
 */
async function loadSettings() {
    try {
        settings = await StorageService.getSettings([
            'geminiApiKey',
            'ttsVoiceURI',
            'ttsSpeed',
            'ttsPitch',
            'autoSaveChats'
        ]);
        
        // Update settings UI
        apiKeyInput.value = settings.geminiApiKey || '';
        ttsSpeedRange.value = settings.ttsSpeed || 1.0;
        ttsPitchRange.value = settings.ttsPitch || 1.0;
        ttsSpeedValue.textContent = settings.ttsSpeed || 1.0;
        ttsPitchValue.textContent = settings.ttsPitch || 1.0;
        autoSaveChats.checked = settings.autoSaveChats !== false;
        
        console.log('Settings loaded');
    } catch (error) {
        console.error('Error loading settings:', error);
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
function populateVoiceSelect() {
    // Clear existing options
    ttsVoiceSelect.innerHTML = '';
    
    // Add each voice as an option
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.voiceURI;
        option.textContent = `${voice.name} (${voice.lang})`;
        
        // Set as selected if it matches the saved voice
        if (settings.ttsVoiceURI === voice.voiceURI) {
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
    // Tab navigation
    chatTabBtn.addEventListener('click', () => switchTab('chat'));
    savedTabBtn.addEventListener('click', () => switchTab('saved'));
    
    // Chat input
    chatInput.addEventListener('input', handleChatInputChange);
    chatInput.addEventListener('keydown', handleChatInputKeydown);
    sendBtn.addEventListener('click', sendMessage);
    
    // Sidebar controls
    refreshContentBtn.addEventListener('click', refreshContent);
    settingsBtn.addEventListener('click', openSettings);
    closeBtn.addEventListener('click', closeSidebar);
    
    // Settings panel
    openSettingsBtn.addEventListener('click', openSettings);
    saveSettingsBtn.addEventListener('click', saveSettings);
    cancelSettingsBtn.addEventListener('click', closeSettings);
    clearChatsBtn.addEventListener('click', clearAllChats);
    
    // TTS range inputs
    ttsSpeedRange.addEventListener('input', () => {
        ttsSpeedValue.textContent = ttsSpeedRange.value;
    });
    ttsPitchRange.addEventListener('input', () => {
        ttsPitchValue.textContent = ttsPitchRange.value;
    });
}

/**
 * Switch between tabs
 * @param {string} tabName - Name of the tab to switch to
 */
function switchTab(tabName) {
    if (tabName === 'chat') {
        chatTab.classList.add('active');
        savedTab.classList.remove('active');
        chatTabBtn.classList.add('active');
        savedTabBtn.classList.remove('active');
    } else if (tabName === 'saved') {
        chatTab.classList.remove('active');
        savedTab.classList.add('active');
        chatTabBtn.classList.remove('active');
        savedTabBtn.classList.add('active');
    }
}

/**
 * Handle chat input changes
 */
function handleChatInputChange() {
    // Enable/disable send button based on input
    sendBtn.disabled = chatInput.value.trim() === '';
    
    // Auto-resize textarea
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}

/**
 * Handle chat input keydown events
 * @param {KeyboardEvent} event - Keydown event
 */
function handleChatInputKeydown(event) {
    // Send message on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!sendBtn.disabled) {
            sendMessage();
        }
    }
}

/**
 * Extract page content from the current webpage
 */
async function extractPageContent() {
    try {
        showLoading(true);
        
        // Request content extraction from content script
        const response = await chrome.runtime.sendMessage({ action: 'extractContent' });
        
        if (response && response.success) {
            pageContent = response.content;
            
            // Show warning if content is minimal
            if (pageContent.length < 500) {
                minimalContent.classList.remove('hidden');
            } else {
                minimalContent.classList.add('hidden');
            }
        } else {
            console.error('Error extracting content:', response?.error);
            minimalContent.classList.remove('hidden');
        }
        
        // Get page metadata
        const metadataResponse = await chrome.runtime.sendMessage({ action: 'getPageMetadata' });
        
        if (metadataResponse && metadataResponse.success) {
            pageMetadata = metadataResponse.metadata;
        }
        
        showLoading(false);
    } catch (error) {
        console.error('Error in content extraction:', error);
        showLoading(false);
        minimalContent.classList.remove('hidden');
    }
}

/**
 * Refresh page content
 */
async function refreshContent() {
    await extractPageContent();
}

/**
 * Send a message to the AI
 */
async function sendMessage() {
    const userQuery = chatInput.value.trim();
    
    if (!userQuery) return;
    
    // Check if API key is set
    if (!settings.geminiApiKey) {
        apiKeyMissing.classList.remove('hidden');
        return;
    }
    
    // Add user message to chat
    addMessageToChat('user', userQuery);
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.disabled = true;
    
    // Add AI message placeholder
    const aiMessageElement = addMessageToChat('ai', '');
    
    try {
        showLoading(true);
        
        // Create request to backend
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: settings.geminiApiKey,
                pageContent: pageContent,
                pageUrl: pageMetadata.pageUrl,
                pageTitle: pageMetadata.pageTitle,
                pageMetaDescription: pageMetadata.pageMetaDescription,
                userQuery: userQuery
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
        }
        
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';
        
        // Create AbortController for cancelling the stream
        currentStreamController = new AbortController();
        const signal = currentStreamController.signal;
        
        // Process stream chunks
        while (true) {
            // Check if stream has been aborted
            if (signal.aborted) {
                break;
            }
            
            const { done, value } = await reader.read();
            
            if (done) {
                break;
            }
            
            // Decode chunk
            const chunk = decoder.decode(value, { stream: true });
            
            // Process SSE format (data: prefix)
            const lines = chunk.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    aiResponse += data;
                    aiMessageElement.querySelector('.message-text').textContent = aiResponse;
                    aiMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            }
        }
        
        // Save chat if auto-save is enabled
        if (settings.autoSaveChats !== false && aiResponse.trim()) {
            await saveChat(userQuery, aiResponse);
        }
        
        showLoading(false);
        currentStreamController = null;
        
        // Add TTS button if there's a response
        if (aiResponse.trim()) {
            addTTSButton(aiMessageElement, aiResponse);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        aiMessageElement.querySelector('.message-text').textContent = 
            'Sorry, an error occurred. Please try again or check your API key.';
        
        showLoading(false);
        currentStreamController = null;
    }
}

/**
 * Add a message to the chat
 * @param {string} sender - 'user' or 'ai'
 * @param {string} text - Message text
 * @returns {HTMLElement} The message element
 */
function addMessageToChat(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const textElement = document.createElement('div');
    textElement.className = 'message-text';
    textElement.textContent = text;
    
    const actionsElement = document.createElement('div');
    actionsElement.className = 'message-actions';
    
    messageElement.appendChild(textElement);
    messageElement.appendChild(actionsElement);
    
    chatMessages.appendChild(messageElement);
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    
    return messageElement;
}

/**
 * Add TTS button to an AI message
 * @param {HTMLElement} messageElement - The message element
 * @param {string} text - Text to speak
 */
function addTTSButton(messageElement, text) {
    const actionsElement = messageElement.querySelector('.message-actions');
    
    // Create TTS button
    const ttsButton = document.createElement('button');
    ttsButton.title = 'Listen';
    ttsButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
    `;
    
    // Add event listener
    ttsButton.addEventListener('click', () => {
        if (currentSpeech && window.speechSynthesis.speaking) {
            // Stop current speech
            window.speechSynthesis.cancel();
            currentSpeech = null;
            ttsButton.title = 'Listen';
        } else {
            // Start new speech
            speakText(text);
            ttsButton.title = 'Stop';
        }
    });
    
    actionsElement.appendChild(ttsButton);
}

/**
 * Speak text using TTS
 * @param {string} text - Text to speak
 */
function speakText(text) {
    // Cancel any current speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (settings.ttsVoiceURI) {
        const voice = voices.find(v => v.voiceURI === settings.ttsVoiceURI);
        if (voice) {
            utterance.voice = voice;
        }
    }
    
    // Set rate and pitch
    utterance.rate = parseFloat(settings.ttsSpeed) || 1.0;
    utterance.pitch = parseFloat(settings.ttsPitch) || 1.0;
    
    // Speak
    window.speechSynthesis.speak(utterance);
    currentSpeech = utterance;
    
    // Handle speech end
    utterance.onend = () => {
        currentSpeech = null;
    };
}

/**
 * Save chat to storage
 * @param {string} question - User's question
 * @param {string} answer - AI's answer
 */
async function saveChat(question, answer) {
    try {
        const chatItem = {
            pageUrl: pageMetadata.pageUrl,
            pageTitle: pageMetadata.pageTitle,
            question: question,
            answer: answer
        };
        
        await StorageService.saveChat(chatItem);
        loadSavedChats();
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}

/**
 * Load saved chats from storage
 */
async function loadSavedChats() {
    try {
        const savedChats = await StorageService.getSavedChats();
        
        // Clear current list
        savedChatsList.innerHTML = '';
        
        if (savedChats.length === 0) {
            const noChatsElement = document.createElement('p');
            noChatsElement.className = 'no-saved-chats';
            noChatsElement.textContent = 'No saved chats yet.';
            savedChatsList.appendChild(noChatsElement);
            return;
        }
        
        // Add each chat to the list
        savedChats.forEach(chat => {
            const chatElement = createSavedChatElement(chat);
            savedChatsList.appendChild(chatElement);
        });
    } catch (error) {
        console.error('Error loading saved chats:', error);
    }
}

/**
 * Create a saved chat element
 * @param {Object} chat - Chat object
 * @returns {HTMLElement} The saved chat element
 */
function createSavedChatElement(chat) {
    const chatElement = document.createElement('div');
    chatElement.className = 'saved-chat-item';
    
    const headerElement = document.createElement('div');
    headerElement.className = 'saved-chat-header';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'saved-chat-title';
    titleElement.textContent = chat.pageTitle || 'Unknown Page';
    titleElement.title = chat.pageUrl || '';
    
    const dateElement = document.createElement('div');
    dateElement.className = 'saved-chat-date';
    dateElement.textContent = formatDate(chat.timestamp);
    
    headerElement.appendChild(titleElement);
    headerElement.appendChild(dateElement);
    
    const questionElement = document.createElement('div');
    questionElement.className = 'saved-chat-question';
    questionElement.textContent = chat.question;
    
    const answerElement = document.createElement('div');
    answerElement.className = 'saved-chat-answer';
    answerElement.textContent = chat.answer;
    
    const actionsElement = document.createElement('div');
    actionsElement.className = 'saved-chat-actions';
    
    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        await StorageService.deleteChat(chat.id);
        loadSavedChats();
    });
    
    actionsElement.appendChild(deleteButton);
    
    chatElement.appendChild(headerElement);
    chatElement.appendChild(questionElement);
    chatElement.appendChild(answerElement);
    chatElement.appendChild(actionsElement);
    
    // Add click event to view full chat
    chatElement.addEventListener('click', () => {
        // Switch to chat tab
        switchTab('chat');
        
        // Add messages to chat
        chatMessages.innerHTML = '';
        addMessageToChat('user', chat.question);
        const aiMessage = addMessageToChat('ai', chat.answer);
        addTTSButton(aiMessage, chat.answer);
    });
    
    return chatElement;
}

/**
 * Format a date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * Clear all saved chats
 */
async function clearAllChats() {
    if (confirm('Are you sure you want to clear all saved chats? This cannot be undone.')) {
        try {
            await StorageService.clearAllChats();
            loadSavedChats();
        } catch (error) {
            console.error('Error clearing chats:', error);
        }
    }
}

/**
 * Open settings panel
 */
function openSettings() {
    settingsPanel.classList.remove('hidden');
}

/**
 * Close settings panel
 */
function closeSettings() {
    settingsPanel.classList.add('hidden');
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
        settings = newSettings;
        
        closeSettings();
        checkApiKey();
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
    }
}

/**
 * Check if API key is set
 */
function checkApiKey() {
    if (!settings.geminiApiKey) {
        apiKeyMissing.classList.remove('hidden');
        sendBtn.disabled = true;
    } else {
        apiKeyMissing.classList.add('hidden');
        sendBtn.disabled = chatInput.value.trim() === '';
    }
}

/**
 * Show or hide loading indicator
 * @param {boolean} show - Whether to show the loading indicator
 */
function showLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

/**
 * Close the sidebar
 */
function closeSidebar() {
    // Stop any ongoing TTS
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        currentSpeech = null;
    }
    
    // Cancel any ongoing stream
    if (currentStreamController) {
        currentStreamController.abort();
        currentStreamController = null;
    }
    
    // Send message to content script to close sidebar
    chrome.runtime.sendMessage({ action: 'toggleSidebar' });
}
