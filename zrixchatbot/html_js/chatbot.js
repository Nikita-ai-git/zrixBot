(function() {
    'use strict';
    
    // Default configuration
    const defaultConfig = {
        primaryColor: '#4e54c8',
        secondaryColor: '#8f94fb',
        title: 'Support Assistant',
        avatarText: 'ZX',
        greeting: 'Hello! I\'m your support assistant. How can I help you today?',
        position: 'bottom-right', // bottom-right, bottom-left
        theme: 'light', // light, dark
        autoOpen: false,
        showNotification: true
    };
    
    // Merge user config with defaults
    const config = Object.assign({}, defaultConfig, window.ChatbotConfig || {});
    
    // CSS Styles
    const styles = `
        .chatbot-widget-container {
            position: fixed;
            ${config.position.includes('right') ? 'right: 30px;' : 'left: 30px;'}
            bottom: 30px;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .chatbot-widget-toggle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(78, 84, 200, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .chatbot-widget-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 7px 25px rgba(78, 84, 200, 0.7);
        }
        
        .chatbot-widget-toggle i {
            font-size: 30px;
        }
        
        .chatbot-widget-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            animation: chatbot-pulse 1.5s infinite;
        }
        
        @keyframes chatbot-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .chatbot-widget-window {
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: translateY(20px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
            position: absolute;
            bottom: 90px;
            ${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
        }
        
        .chatbot-widget-window.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .chatbot-widget-header {
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .chatbot-widget-header h3 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
            font-size: 1.1rem;
        }
        
        .chatbot-widget-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${config.primaryColor};
            font-weight: bold;
            font-size: 18px;
        }
        
        .chatbot-widget-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        .chatbot-widget-close:hover {
            transform: rotate(90deg);
        }
        
        .chatbot-widget-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .chatbot-widget-message {
            max-width: 80%;
            padding: 12px 18px;
            border-radius: 18px;
            position: relative;
            animation: chatbot-fadeIn 0.3s ease;
        }
        
        @keyframes chatbot-fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .chatbot-widget-bot-message {
            background: #e9ecf1;
            color: #333;
            border-bottom-left-radius: 5px;
            align-self: flex-start;
        }
        
        .chatbot-widget-user-message {
            background: ${config.primaryColor};
            color: white;
            border-bottom-right-radius: 5px;
            align-self: flex-end;
        }
        
        .chatbot-widget-input {
            display: flex;
            padding: 15px;
            background: white;
            border-top: 1px solid #eee;
            gap: 10px;
        }
        
        .chatbot-widget-input input {
            flex: 1;
            padding: 12px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 30px;
            outline: none;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .chatbot-widget-input input:focus {
            border-color: ${config.primaryColor};
        }
        
        .chatbot-widget-input button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: ${config.primaryColor};
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        
        .chatbot-widget-input button:hover {
            background: #3a40b4;
        }
        
        .chatbot-widget-input button i {
            font-size: 20px;
        }
        
        .chatbot-widget-typing-indicator {
            display: flex;
            align-items: center;
            padding: 8px 15px;
            background: #e9ecf1;
            border-radius: 18px;
            width: fit-content;
            margin-top: 5px;
        }
        
        .chatbot-widget-typing-indicator span {
            height: 8px;
            width: 8px;
            background: #999;
            border-radius: 50%;
            display: inline-block;
            margin: 0 2px;
            animation: chatbot-typing 1s infinite;
        }
        
        .chatbot-widget-typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .chatbot-widget-typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes chatbot-typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .chatbot-widget-window {
                width: 90vw;
                right: 5vw !important;
                left: 5vw !important;
                bottom: 85px;
            }
            
            .chatbot-widget-toggle {
                width: 60px;
                height: 60px;
                bottom: 20px;
                right: 20px;
            }
        }
    `;
    
    // Create and inject CSS
    function injectCSS() {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        
        // Load Font Awesome if not already loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
    }
    
    // Create chatbot HTML
    function createChatbotHTML() {
        const container = document.createElement('div');
        container.className = 'chatbot-widget-container';
        container.innerHTML = `
            <button class="chatbot-widget-toggle">
                <i class="fas fa-comment-dots"></i>
                ${config.showNotification ? '<span class="chatbot-widget-notification">2</span>' : ''}
            </button>
            
            <div class="chatbot-widget-window">
                <div class="chatbot-widget-header">
                    <h3>
                        <span class="chatbot-widget-avatar">${config.avatarText}</span>
                        ${config.title}
                    </h3>
                    <button class="chatbot-widget-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-widget-messages">
                    <div class="chatbot-widget-message chatbot-widget-bot-message">
                        ${config.greeting}
                    </div>
                </div>
                
                <div class="chatbot-widget-input">
                    <input type="text" placeholder="Type a message...">
                    <button>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        return container;
    }
    
    // Initialize chatbot functionality
    function initializeChatbot(container) {
        const toggleBtn = container.querySelector('.chatbot-widget-toggle');
        const closeBtn = container.querySelector('.chatbot-widget-close');
        const chatWindow = container.querySelector('.chatbot-widget-window');
        const sendBtn = container.querySelector('.chatbot-widget-input button');
        const inputField = container.querySelector('.chatbot-widget-input input');
        const messagesContainer = container.querySelector('.chatbot-widget-messages');
        const notification = container.querySelector('.chatbot-widget-notification');
        
        // Toggle chat window
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (notification) {
                notification.style.display = 'none';
            }
        });
        
        // Close chat window
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
        
        // Send message
        function sendMessage() {
            const message = inputField.value.trim();
            if (message) {
                // Add user message
                addMessage(message, 'user');
                
                // Clear input
                inputField.value = '';
                
                // Show typing indicator
                showTypingIndicator();
                
                // Simulate bot response after a short delay
                setTimeout(() => {
                    // Remove typing indicator
                    const typingIndicator = messagesContainer.querySelector('.chatbot-widget-typing-indicator');
                    if (typingIndicator) {
                        typingIndicator.remove();
                    }
                    
                    // Generate and add bot response
                    const botResponse = generateBotResponse(message);
                    addMessage(botResponse, 'bot');
                }, 1500);
            }
        }
        
        // Send message on button click
        sendBtn.addEventListener('click', sendMessage);
        
        // Send message on Enter key
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Add message to chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chatbot-widget-message');
            messageDiv.classList.add('chatbot-widget-' + sender + '-message');
            messageDiv.textContent = text;
            messagesContainer.appendChild(messageDiv);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('chatbot-widget-typing-indicator');
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            messagesContainer.appendChild(typingDiv);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
// Async function to fetch response from your FastAPI endpoint
async function generateBotResponse(message) {
    try {
        // Encode user message to safely include in URL
        const encodedMessage = encodeURIComponent(message);

        // Call the backend API
        const response = await fetch(`http://127.0.0.1:8000/chat?query=${encodedMessage}`);
        
        // Parse the JSON response
        const data = await response.json();

        // Extract the 'answer' field from the response
        if (data && data.answer) {
            return data.answer;
        } else {
            return "I'm sorry, I couldn't understand the response from the server.";
        }
    } catch (error) {
        console.error("Error fetching response from backend:", error);
        return "Oops! There was an error processing your request. Please try again later.";
    }
}

async function sendMessage() {
    const message = inputField.value.trim();
    if (message) {
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        inputField.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Get bot response from API
            const botResponse = await generateBotResponse(message);
            
            // Remove typing indicator
            const typingIndicator = messagesContainer.querySelector('.chatbot-widget-typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Add bot response
            addMessage(botResponse, 'bot');
            
        } catch (error) {
            console.error('Error getting bot response:', error);
            
            // Remove typing indicator
            const typingIndicator = messagesContainer.querySelector('.chatbot-widget-typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Add error message
            addMessage("Sorry, I'm having trouble responding right now. Please try again.", 'bot');
        }
    }
}
        // Auto-open if configured
        if (config.autoOpen) {
            setTimeout(() => {
                chatWindow.classList.add('active');
            }, 2000);
        }
        
        // Show notification after delay
        if (config.showNotification && notification) {
            setTimeout(() => {
                notification.style.display = 'flex';
            }, 3000);
        }
    }
    
    // Initialize when DOM is ready
    function init() {
        injectCSS();
        const container = createChatbotHTML();
        initializeChatbot(container);
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
