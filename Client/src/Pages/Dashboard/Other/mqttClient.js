var mqtt = require('mqtt')

var options = {
    port: 36736,
    host: 'ws://farmer.cloudmqtt.com',
    clientId: 'receiver',
    username: 'elmyzmin',
    password: 'POq5B4tgE72j',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

var client  = mqtt.connect('wss://farmer.cloudmqtt.com', options);

client.on('connect', function () {
    client.subscribe('stream');
});

function startStream(cb) {
    client.on('message', (topic, datapoints) => cb(null, [...datapoints]));
}

function stopStream() {
    console.log("hi");
  }
  
  export { startStream, stopStream};