require('dotenv').config();

const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { joinChat, userLeave, randomColor, getUsers } = require('./functions');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/chat.html', (req, res) => {
    if (req.query.username) {
        res.sendFile(path.join(__dirname, 'chat.html')); // Serve chat.html from the root directory
    } else {
        res.redirect(401, '/');
    }
});

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
    const color = randomColor();
    socket.emit('randomColor', color);
    socket.emit('messageBOT', 'Welcome to Webchat');   

    socket.on('join', username => {
        const user = joinChat(socket.id, username);
        io.emit('showUsers', getUsers());
        socket.broadcast.emit('messageBOT', `${user.username} has joined the Webchat`);
    });

    socket.on('chatMsg', (msgValue, username, colorname) => {
        socket.broadcast.emit('message', msgValue, username, colorname);
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {  
            io.emit('messageBOT', `${user.username} has left the chat`);
        }
        io.emit('showUsers', getUsers());
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
