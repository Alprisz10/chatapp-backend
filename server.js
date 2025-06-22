const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3000;

app.use(express.static('public'));

const users = {};

io.on('connection', socket => {
  console.log('User connected');

  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-online', name);
  });

  socket.on('chat-message', data => {
    socket.broadcast.emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      socket.broadcast.emit('user-offline', name);
      delete users[socket.id];
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});