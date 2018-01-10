var socket = io();

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
       return null;
    }
    else {
       return decodeURI(results[1]) || 0;
    }
};

var userName = $.urlParam('name'),
    roomName = $.urlParam('room'),
    rooms = [];

socket.on('connect', function () {
    socket.on('getRoomsList', function(users) {
        let roomsList = $('#rooms');
        users.forEach(function (user) {
            if(rooms.indexOf(user.room) < 0) {
                let roomItem = $('<option>');
                roomItem.attr({value: user.room});
                roomsList.append(roomItem);
                rooms.push(user.room);
            }
        });

        $('#room-select').append(roomsList)
    });

    socket.emit('join', {name: userName, room: roomName}, function(error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        } else { console.log('no error') }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    var ol = $('<ol></ol>');
    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol)
});

socket.on('newMessage', function (message) {
    var li = $('<li class="msg"></li>'),
        name = $('<div class="user-name">' + message.from + ' ' + message.createAt + '</div>'),
        msg = $('<div>' + message.text + '</div>');

    li.append(name)
    li.append(msg)

    $('#messages').append(li);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var li = $('<li class="msg location"></li>'),
        a = $('<a target="_blank">My location</a>');

    li.text(message.from + ' ' + message.createAt + ' :');
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
    scrollToBottom();
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        text: $('[name=message]').val()
    }, function () {
        $('[name=message]').val('');
    });
});

var locationBtn = $('#send-location');

locationBtn.on('click', function () {
    if (!navigator.geolocation) return alert('GEO not supported by your browser');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
    }, function () {
        alert('Unable to fetch location');
    })
});

var typing = $('#typing');

$('[name=message]').keypress((function() {
    socket.emit('typing', userName + ' is typing...');
}));

socket.on('showTyping', function(data) {
    if(data.user.name !== userName) {
        typing.fadeIn({
            duration: 1500,
            start: function() {
                typing.text(data.text);
                
            },
            done: function () {
                typing.fadeOut();
            }
        });
    }
});

function scrollToBottom() {
    var messages = $('#messages'),
        scrollTop = messages.prop('scrollHeight');
    if(messages.prop('clientHeight') < scrollTop) messages.scrollTop(scrollTop);
};