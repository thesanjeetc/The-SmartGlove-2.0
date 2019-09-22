//client.js
var io = require('socket.io-client');

let local = false;
var socket = io.connect(local ? 'http://127.0.0.1:8000/glove' : 'https://thesmartglove.herokuapp.com/glove', {reconnect: true});

// Add a connect listener
socket.on('connect', function (data) {
    socket.emit('batteryLevel', 21);
});