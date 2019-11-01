var mqtt = require('mqtt')

var options = {
    port: 16736,
    host: 'mqtt://farmer.cloudmqtt.com',
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

var client  = mqtt.connect('mqtt://farmer.cloudmqtt.com', options)

client.on('connect', function () {
  client.subscribe('stream');
})


let datapoints = [];

client.on('message', function (topic, message) {
    datapoints = [...message];
    console.log(datapoints);
})