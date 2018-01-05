const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 5000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('join', (params, cb) => {
        if(isRealString(params.name) === null || !isRealString(params.room) === null) cb();
        else if (!isRealString(params.name) || !isRealString(params.room)) cb('Name and room name are required.');

        socket.join(params.room);

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        cb();
    });

    socket.on('createMessage', (message, cb) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        cb('This is from the server.');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
    });
});

server.listen(port, () => {
    console.log(`Server started on port:${port}`)
});