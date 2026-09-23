document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const onboardingOverlay = document.getElementById('onboarding-overlay');
    const findStrangerBtn = document.getElementById('find-stranger-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const mobileNewChatBtn = document.getElementById('mobile-new-chat-btn');
    const skipBtn = document.getElementById('skip-btn');
    const endChatBtn = document.getElementById('end-chat-btn');
    
    const sidebarStatusIndicator = document.getElementById('sidebar-status-indicator');
    const sidebarStatusText = document.getElementById('sidebar-status-text');
    const sidebarSubtext = document.getElementById('sidebar-subtext');
    
    const headerStatusText = document.getElementById('header-status-text');
    const chatMessages = document.getElementById('chat-messages');
    
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const imageUploadInput = document.getElementById('image-upload');

    const myGenderSelect = document.getElementById('my-gender');
    const matchGenderSelect = document.getElementById('match-gender');

    const emojiBtn = document.getElementById('emoji-btn');
    const stickerBtn = document.getElementById('sticker-btn');
    const emojiPopup = document.getElementById('emoji-popup');
    const stickerPopup = document.getElementById('sticker-popup');
    const customEmojiPicker = document.getElementById('custom-emoji-picker');
    const stickerOptions = document.querySelectorAll('.sticker-option');

    let socket;
    let isConnected = false;

    // Mobile viewport fix
    function setAppHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }
    window.addEventListener('resize', setAppHeight);
    setAppHeight();

    // Emoji & Sticker Logic
    emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPopup.classList.toggle('hidden');
        stickerPopup.classList.add('hidden');
    });

    stickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stickerPopup.classList.toggle('hidden');
        emojiPopup.classList.add('hidden');
    });

    const emojiCategories = {
        "Smilies": ["😀","😃","😄","😁","😆","😅","😂","🤣","🥲","☺️","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","👽","👾","🤖"],
        "Hands & Body": ["👋","🤚","🖐","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦵","🦿","🦶","👣","👂","🦻","👃","🫀","🫁","🧠","🦷","🦴","👀","👁","👅","👄","💋","🩸"],
        "Animals & Nature": ["🐵","🐒","🦍","🦧","🐶","🐕","🦮","🐕‍🦺","🐩","🐺","🦊","🦝","🐱","🐈","🐈‍⬛","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🦬","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦙","🦒","🐘","🦣","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🐿","🦫","🦔","🦇","🐻","🐻‍❄️","🐨","🐼","🦥","🦦","🦨","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊","🦅","🦆","🦢","🦉","🦤","🪶","🦩","🦚","🦜","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🦭","🐟","🐠","🐡","🦈","🐙","🐚","🐌","🦋","🐛","🐜","🐝","🪲","🐞","🦗","🪳","🕷","🕸","🦂","🦟","🪰","🪱","🦠","💐","🌸","💮","🏵","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🪴","🌲","🌳","🌴","🌵","🌾","🌿","☘️","🍀","🍁","🍂","🍃"],
        "Food": ["🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🫐","🥝","🍅","🫒","🥥","🥑","🍆","🥔","🥕","🌽","🌶","🫑","🥒","🥬","🥦","🧄","🧅","🍄","🥜","🌰","🍞","🥐","🥖","🫓","🥨","🥯","🥞","🧇","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🫔","🥙","🧆","🥚","🍳","🥘","🍲","🫕","🥣","🥗","🍿","🧈","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🫖","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🧋","🧃","🧉","🧊","🥢","🍽","🍴","🥄"]
    };

    for (const [category, emojis] of Object.entries(emojiCategories)) {
        const title = document.createElement('div');
        title.className = 'emoji-category-title';
        title.innerText = category;
        customEmojiPicker.appendChild(title);
        
        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'emoji-btn-item';
            btn.innerText = emoji;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                messageInput.value += emoji;
                messageInput.focus();
                sendBtn.disabled = false;
            });
            customEmojiPicker.appendChild(btn);
        });
    }

    stickerOptions.forEach(option => {
        option.addEventListener('click', () => {
            const stickerFile = option.getAttribute('data-sticker');
            sendMessage(`stickers/${stickerFile}`, true);
            stickerPopup.classList.add('hidden');
        });
    });

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        if (!emojiBtn.contains(e.target) && !emojiPopup.contains(e.target)) {
            emojiPopup.classList.add('hidden');
        }
        if (!stickerBtn.contains(e.target) && !stickerPopup.contains(e.target)) {
            stickerPopup.classList.add('hidden');
        }
    });

    // Show onboarding immediately
    onboardingOverlay.classList.add('active');

    // Setup WebSocket
    function setupWebSocket() {
        if (socket) {
            socket.close();
        }
        let wsUrl;
        if (window.location.protocol === 'file:') {
            // When opened directly as an HTML file
            wsUrl = 'ws://localhost:3000';
        } else if (window.location.port === '8000') {
            // When accessed via Python HTTP server (from start.bat)
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl = `${wsProtocol}//${window.location.hostname}:8765`;
        } else {
            // When accessed via the Node.js server (e.g. Render, Railway, or local port 3000)
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl = `${wsProtocol}//${window.location.host}`;
        }
        socket = new WebSocket(wsUrl);
        socket.onopen = () => {
            console.log("Connected to server");
            const myGender = myGenderSelect.value;
            const matchGender = matchGenderSelect.value;
            socket.send(JSON.stringify({
                type: 'find_match',
                my_gender: myGender,
                match_gender: matchGender
            }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'match_found') {
                handleMatchFound();
            } else if (data.type === 'message') {
                addMessage(data.text, 'received');
            } else if (data.type === 'image') {
                addImageMessage(data.dataUrl, 'received');
            } else if (data.type === 'stranger_disconnected') {
                strangerDisconnect();
            }
        };

        socket.onclose = () => {
            console.log("Disconnected from server");
            if (isConnected) {
                strangerDisconnect();
                addSystemMessage("Lost connection to server.");
            }
        };
    }

    // Event Listeners
    findStrangerBtn.addEventListener('click', startSearch);
    newChatBtn.addEventListener('click', startSearch);
    mobileNewChatBtn.addEventListener('click', startSearch);
    skipBtn.addEventListener('click', skipChat);
    endChatBtn.addEventListener('click', disconnectChat);
    
    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    uploadBtn.addEventListener('click', () => {
        if (isConnected) {
            imageUploadInput.click();
        }
    });

    imageUploadInput.addEventListener('change', handleImageUpload);

    function startSearch() {
        // Hide overlay if it's open
        onboardingOverlay.classList.remove('active');
        
        // Clear chat
        chatMessages.innerHTML = '';
        isConnected = false;
        disableInput();

        // Update UI to searching state
        sidebarStatusIndicator.className = 'status-indicator searching';
        sidebarStatusText.innerText = 'Searching...';
        sidebarSubtext.innerText = 'Looking for a match';
        newChatBtn.classList.add('hidden');
        mobileNewChatBtn.classList.add('hidden');
        skipBtn.classList.remove('hidden');
        endChatBtn.classList.remove('hidden');
        
        headerStatusText.innerText = 'Waiting to connect...';
        headerStatusText.className = 'status';

        addSystemMessage("Looking for someone you can chat with...");

        setupWebSocket();
    }

    function handleMatchFound() {
        isConnected = true;
        enableInput();

        // Update UI to connected state
        sidebarStatusIndicator.className = 'status-indicator connected';
        sidebarStatusText.innerText = 'Connected';
        sidebarSubtext.innerText = 'Say hi!';
        newChatBtn.classList.add('hidden');
        mobileNewChatBtn.classList.add('hidden');
        skipBtn.classList.remove('hidden');
        endChatBtn.classList.remove('hidden');

        headerStatusText.innerText = 'Online';
        headerStatusText.className = 'status online';

        addSystemMessage("You're now chatting with a random stranger. Say hi!");
    }

    function disconnectChat() {
        if (socket) {
            socket.close();
        }
        if (!isConnected) return;
        
        isConnected = false;
        disableInput();
        
        sidebarStatusIndicator.className = 'status-indicator';
        sidebarStatusText.innerText = 'Disconnected';
        sidebarSubtext.innerText = 'You ended the chat.';
        newChatBtn.classList.remove('hidden');
        mobileNewChatBtn.classList.remove('hidden');
        skipBtn.classList.add('hidden');
        endChatBtn.classList.add('hidden');

        headerStatusText.innerText = 'Disconnected';
        headerStatusText.className = 'status';

        addSystemMessage("You have disconnected.");
    }

    function strangerDisconnect() {
        if (!isConnected) return;
        
        isConnected = false;
        disableInput();
        if (socket) socket.close();
        
        sidebarStatusIndicator.className = 'status-indicator';
        sidebarStatusText.innerText = 'Disconnected';
        sidebarSubtext.innerText = 'Stranger disconnected.';
        newChatBtn.classList.remove('hidden');
        mobileNewChatBtn.classList.remove('hidden');
        skipBtn.classList.add('hidden');
        endChatBtn.classList.add('hidden');

        headerStatusText.innerText = 'Disconnected';
        headerStatusText.className = 'status';

        addSystemMessage("Stranger has disconnected.");
    }

    function skipChat() {
        if (socket) {
            socket.onclose = null;
            socket.onmessage = null;
            socket.close();
        }
        startSearch();
    }

    function handleSendMessage() {
        if (!isConnected || !socket) return;
        
        const text = messageInput.value.trim();
        if (text === '') return;

        addMessage(text, 'sent');
        socket.send(JSON.stringify({
            type: 'message',
            text: text
        }));
        
        messageInput.value = '';
    }

    function handleImageUpload(e) {
        if (!isConnected || !socket) return;
        
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const dataUrl = event.target.result;
                addImageMessage(dataUrl, 'sent');
                
                socket.send(JSON.stringify({
                    type: 'image',
                    dataUrl: dataUrl
                }));
            };
            reader.readAsDataURL(file);
            
            // Reset input
            imageUploadInput.value = '';
        }
    }

    function addImageMessage(dataUrl, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <img src="${dataUrl}" alt="Sent image">
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        
        // Allow image to render before scrolling
        setTimeout(scrollToBottom, 50);
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.innerText = text;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function disableInput() {
        messageInput.disabled = true;
        sendBtn.disabled = true;
        uploadBtn.style.opacity = '0.5';
        uploadBtn.style.cursor = 'not-allowed';
    }

    function enableInput() {
        messageInput.disabled = false;
        sendBtn.disabled = false;
        uploadBtn.style.opacity = '1';
        uploadBtn.style.cursor = 'pointer';
        messageInput.focus();
    }
});
