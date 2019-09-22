//client.js
var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:8000/glove', {reconnect: true});

// Add a connect listener
socket.on('connect', function (data) {
    socket.emit('batteryLevel', 21);
});