const path = require('path');
const http = require('http');
const url = require('url');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment')

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
    socket.on('JOIN_USER', (params, callback) => {
        let usersNames = users.getUserList(params.room);
        console.log('names: ', usersNames);

        if (usersNames.indexOf(params.name) > -1) return callback('The name is already used');

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        // io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('RECEIVE_MESSAGE', { from: 'Admin', text: 'Welcome to the chat', at: moment().format('kk:mm:ss') });
        socket.broadcast.to(params.room).emit('RECEIVE_MESSAGE', {
            from: 'Admin',
            text: `${params.name} has joined to the room`,
            at: moment().format('kk:mm:ss')
        });
    });

    socket.on('SEND_MESSAGE', (data) => {
        let user = users.getUser(socket.id);

        if (user && data.text) {
            io.to(user.room).emit('RECEIVE_MESSAGE', data);
        }
    });

    // socket.on('createLocationMessage', (coords) => {
    //     let user = users.getUser(socket.id);

    //     if(user) {
    //         io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng));
    //     }
    // });

    socket.on('USER_IS_TYPING', (text) => {
        let user = users.getUser(socket.id);

        if(text) {
            io.to(user.room).emit('SHOW_TYPING', {user, text})
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('RECEIVE_MESSAGE', {
                from: 'Admin',
                text: `${user.name} has left the room`,
                at: moment().format('kk:mm:ss')
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on port:${port}`);
});