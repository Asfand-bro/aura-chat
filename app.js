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

    let currentRoomId = null;
    let myUserId = null;
    let messagesRef = null;
    let roomRef = null;
    let waitingRef = null;
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

    // Setup Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyB3WHYWFZoW0i1VbP4eIYhMvwDny8H8sIA",
      authDomain: "aura-app-62693.firebaseapp.com",
      projectId: "aura-app-62693",
      databaseURL: "https://aura-app-62693-default-rtdb.firebaseio.com",
      storageBucket: "aura-app-62693.firebasestorage.app",
      messagingSenderId: "34222824047",
      appId: "1:34222824047:web:b99e78a2eb94db552ecb9a"
    };
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    function generateId() {
        return Math.random().toString(36).substring(2, 15);
    }

    function isMatch(myGen, myMatchGen, strangerGen, strangerMatchGen) {
        const match1 = myMatchGen === 'any' || myMatchGen === strangerGen;
        const match2 = strangerMatchGen === 'any' || strangerMatchGen === myGen;
        return match1 && match2;
    }

    function cleanupConnections() {
        if (waitingRef) {
            waitingRef.remove();
            waitingRef.onDisconnect().cancel();
        }
        if (myUserId) {
            database.ref(`matched/${myUserId}`).off();
            database.ref(`matched/${myUserId}`).remove();
            database.ref(`matched/${myUserId}`).onDisconnect().cancel();
        }
        if (messagesRef) messagesRef.off();
        if (roomRef) {
            roomRef.child('status').off();
            if (isConnected) roomRef.child('status').set('disconnected');
            roomRef.child('status').onDisconnect().cancel();
        }
    }

    function joinRoom(roomId) {
        currentRoomId = roomId;
        roomRef = database.ref(`rooms/${roomId}`);
        messagesRef = database.ref(`rooms/${roomId}/messages`);
        
        // Handle disconnect during chat
        roomRef.child('status').onDisconnect().set('disconnected');
        
        handleMatchFound();
        
        // Listen for messages
        messagesRef.on('child_added', (snap) => {
            const msg = snap.val();
            if (msg.senderId !== myUserId) {
                if (msg.type === 'message') {
                    addMessage(msg.text, 'received');
                } else if (msg.type === 'image') {
                    addImageMessage(msg.dataUrl, 'received');
                }
            }
        });
        
        // Listen for partner disconnect
        roomRef.child('status').on('value', (snap) => {
            if (snap.val() === 'disconnected' && isConnected) {
                strangerDisconnect();
            }
        });
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

    async function startSearch() {
        // Hide overlay if it's open
        onboardingOverlay.classList.remove('active');
        
        // Clear chat
        chatMessages.innerHTML = '';
        isConnected = false;
        disableInput();
        cleanupConnections();

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

        myUserId = generateId();
        const myGender = myGenderSelect.value;
        const matchGender = matchGenderSelect.value;

        try {
            // 1. Fetch waiting pool
            const snapshot = await database.ref('waiting').once('value');
            const waitingPool = snapshot.val() || {};
            
            let matchedPartnerId = null;
            for (const [partnerId, data] of Object.entries(waitingPool)) {
                if (isMatch(myGender, matchGender, data.myGender, data.matchGender)) {
                    matchedPartnerId = partnerId;
                    break;
                }
            }
            
            if (matchedPartnerId) {
                // Remove from waiting pool
                await database.ref(`waiting/${matchedPartnerId}`).remove();
                
                // Create room
                currentRoomId = generateId();
                await database.ref(`rooms/${currentRoomId}`).set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                
                // Notify partner
                await database.ref(`matched/${matchedPartnerId}`).set(currentRoomId);
                
                joinRoom(currentRoomId);
            } else {
                // Join waiting pool
                waitingRef = database.ref(`waiting/${myUserId}`);
                await waitingRef.set({
                    myGender,
                    matchGender,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                
                // Handle disconnect while waiting
                waitingRef.onDisconnect().remove();
                database.ref(`matched/${myUserId}`).onDisconnect().remove();
                
                // Listen for match
                database.ref(`matched/${myUserId}`).on('value', (snap) => {
                    const roomId = snap.val();
                    if (roomId) {
                        database.ref(`matched/${myUserId}`).off();
                        database.ref(`matched/${myUserId}`).remove();
                        waitingRef.remove();
                        joinRoom(roomId);
                    }
                });
            }
        } catch (error) {
            console.error("Matchmaking error:", error);
            addSystemMessage("Could not connect to the database. Check your internet or Firebase rules.");
        }
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
        if (!isConnected) return;
        cleanupConnections();
        
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
        cleanupConnections();
        
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
        cleanupConnections();
        startSearch();
    }

    function handleSendMessage() {
        if (!isConnected || !messagesRef) return;
        
        const text = messageInput.value.trim();
        if (text === '') return;

        addMessage(text, 'sent');
        messagesRef.push({
            type: 'message',
            text: text,
            senderId: myUserId,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        messageInput.value = '';
    }

    function handleImageUpload(e) {
        if (!isConnected || !messagesRef) return;
        
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const dataUrl = event.target.result;
                addImageMessage(dataUrl, 'sent');
                
                messagesRef.push({
                    type: 'image',
                    dataUrl: dataUrl,
                    senderId: myUserId,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
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
