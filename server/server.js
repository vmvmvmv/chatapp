const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 5000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('disconnect', () => {
        console.log('user was disconnected')
    });

    socket.emit('newMessage', generateMessage('Obi', 'Hello'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message) => {
        io.emit('newMessage', generateMessage(message.from, message.text))
    });
});

server.listen(port, () => {
    console.log(`Server started on port:${port}`)
});