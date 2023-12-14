const socket = io();

socket.on('chat message', (data) => {
    appendMessage(data.message, data.sender, 'received');
});

function sendMessage() {
    const message = document.getElementById('m').value.trim();
    if (message !== '') {
        appendMessage(message, 'me', 'sent');
        socket.emit('chat message', { message, sender: 'me' });
        document.getElementById('m').value = '';
    }
}

function appendMessage(message, sender, type) {
    const chatContainer = document.getElementById('chat');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.classList.add('message');
    messageDiv.classList.add(type === 'sent' ? 'sent-message' : 'received-message');

    messageContainer.appendChild(messageDiv);

    if (type === 'received') {
        const senderDiv = document.createElement('div');
        senderDiv.textContent = 'Sender: ' + sender;
        messageContainer.appendChild(senderDiv);
    }

    chatContainer.appendChild(messageContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight;

}

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('m').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const editor = ace.edit("code-editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

function sendChanges(changes) {
    socket.emit('editor-changes', { changes, userId: 'uniqueUserId' });
}

function updateCode() {
    const changes = editor.getSession().getDocument().getChanges();
    sendChanges(changes);
}

socket.on('editor-changes', (data) => {
    const changes = data.changes;
    editor.getSession().getDocument().applyDeltas(changes);
});

socket.on('code-update', (code) => {
    editor.setValue(code, 1);
});

function runCode() {
    const code = editor.getValue();
    const apiKey = '10fd9ecbf0a9779f3b94743e9c880b47';
    const apiSecret = 'c44918b424b99d0a044b86996c85c0ab014dd686b6889bca25bff8b847a8f64';
    const apiUrl = 'https://api.jdoodle.com/v1/execute';

    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clientId: apiKey,
            clientSecret: apiSecret,
            script: code,
            language: 'javascript',
        }),
    };

    fetch(apiUrl, requestData)
        .then(response => response.json())
        .then(result => {
            const outputContainer = document.getElementById('output');
            outputContainer.textContent = result.output || result.error || 'No output';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('m').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
editor.getSession().on('change', updateCode);

