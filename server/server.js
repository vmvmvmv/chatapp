const path = require('path');
const http = require('http');
const url = require('url');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 5000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();


app.use("/assets/styles",  express.static(publicPath + '/assets/styles'));
app.use("/scripts", express.static(publicPath + '/scripts'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('*', function(req, res) {
    res.render(publicPath + '/index')
});

io.on('connection', (socket) => {
    socket.emit('getRoomsList', users.users)
    socket.on('join', (params, callback) => {
        let usersNames = users.getUserList(params.room);

        if (isRealString(params.name) === null || !isRealString(params.room) === null) return;
        else if (!isRealString(params.name) || !isRealString(params.room)) return callback('Name and room name are required');
        else if (usersNames.indexOf(params.name) > -1) return callback('The name is already used');

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            callback();
        }
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng));
        }
    });

    socket.on('typing', (text) => {
        let user = users.getUser(socket.id);

        if(text) {
            io.to(user.room).emit('showTyping', {user, text})
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on port:${port}`);
});