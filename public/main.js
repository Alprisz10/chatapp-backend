const socket = io();
let myName = '';

function saveName() {
  const input = document.getElementById('username');
  if (input.value.trim()) {
    myName = input.value.trim();
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('chatApp').style.display = 'flex';
    socket.emit('new-user', myName);
  }
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const msg = input.value.trim();
  if (msg) {
    appendMessage(msg, 'right', myName);
    socket.emit('chat-message', { name: myName, message: msg });
    input.value = '';
  }
}

function appendMessage(msg, side, sender) {
  const msgContainer = document.getElementById('messages');
  const div = document.createElement('div');
  div.classList.add('message', side);
  div.innerHTML = `<div class="sender">${sender}</div><div>${msg}</div>`;
  msgContainer.appendChild(div);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

function showStatus(text) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = text;
  statusDiv.style.display = 'block';
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

socket.on('chat-message', data => {
  appendMessage(data.message, 'left', data.name);
});

socket.on('user-online', name => {
  if (name !== myName) showStatus(`ID ${name} telah online`);
});

socket.on('user-offline', name => {
  if (name !== myName) showStatus(`ID ${name} telah offline`);
});