const socket = io();
let username = '';

// Join chat
function joinChat() {
    username = document.getElementById('username').value.trim();
    if (username) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'block';
        socket.emit('join', username);
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (text && username) {
        socket.emit('message', text);
        input.value = '';
    }
}

// Receive events from server
socket.on('user joined', (user) => {
    addSystemMessage(`${user} joined the chat`);
});

socket.on('user left', (user) => {
    addSystemMessage(`${user} left the chat`);
});

socket.on('message', (msg) => {
    addMessage(msg);
});

socket.on('messages', (history) => {
    history.forEach(addMessage);
});

// Helpers
function addMessage(msg) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(msg.from === username ? 'sent' : 'received');
    messageDiv.innerHTML = `<strong>${msg.from}:</strong> ${msg.text} <small>${msg.timestamp}</small>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.style.color = '#666';
    messageDiv.style.fontStyle = 'italic';
    messageDiv.innerHTML = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}