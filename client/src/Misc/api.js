import openSocket from 'socket.io-client';
import Config from './config'

let socket;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  socket = openSocket('http://127.0.0.1:8000');
} else {
  socket = openSocket(window.location.hostname);
}

function startStream(cb) {
  socket.on('newData', timestamp => cb(null, timestamp));
  socket.emit('startStream', Config.streamInterval, Config.numSensors);
}

function stopStream() {
  socket.emit('stopStream');
}

export { startStream, stopStream};