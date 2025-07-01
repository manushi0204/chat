const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-user', (username) => {
    socket.username = username;
    socket.broadcast.emit('user-joined', username);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { user: socket.username, msg });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('user-left', socket.username);
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
