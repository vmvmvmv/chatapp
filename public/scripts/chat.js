var socket = io();

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

socket.on('connect', function () {
    var userName = $.urlParam('name'),
        roomName = $.urlParam('room');
    socket.emit('join', {name: userName, room: roomName}, function(error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        } else {
            console.log('no error')
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    let ol = $('<ol></ol>');
    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol)
});

socket.on('newMessage', function (message) {
    var li = $('<li></li>');
    li.text(`${message.from} ${message.createAt} : ${message.text}`)

    $('#messages').append(li);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My location</a>');

    li.text(`${message.from} ${message.createAt}: `);
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

function scrollToBottom() {
    var messages = $('#messages'),
        scrollTop = messages.prop('scrollHeight');
    if(messages.prop('clientHeight') < scrollTop) messages.scrollTop(scrollTop);
}   