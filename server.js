const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.set('trust proxy', 1);  // For HTTPS
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
    allowEIO3: true  // For compatibility
});

app.use(express.static('public'));

let users = {};
let messages = [];

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('user joined', username);
        socket.emit('messages', messages);
    });

    socket.on('message', (msg) => {
        const message = {
            from: users[socket.id],
            text: msg,
            timestamp: new Date().toLocaleTimeString()
        };
        messages.push(message);
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            io.emit('user left', users[socket.id]);
            delete users[socket.id];
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});