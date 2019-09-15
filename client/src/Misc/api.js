import openSocket from 'socket.io-client';
import Config from './config'

const  socket = openSocket('http://127.0.0.1:8000');

function startStream(cb) {
  socket.on('newData', timestamp => cb(null, timestamp));
  socket.emit('startStream', Config.streamInterval, Config.numSensors);
}

function stopStream() {
  socket.emit('stopStream');
}

export { startStream, stopStream};