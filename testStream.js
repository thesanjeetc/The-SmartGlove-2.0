var mqtt = require('mqtt')

var options = {
    port: 16736,
    host: 'mqtt://farmer.cloudmqtt.com',
    clientId: 'smartglove',
    username: 'elmyzmin',
    password: 'POq5B4tgE72j',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'binary'
};

var client  = mqtt.connect('mqtt://farmer.cloudmqtt.com', options)

client.on('connect', function () {
  client.subscribe('stream', function (err) {
    if (!err) {
        let x = 0;
        dataStream = setInterval(() => {
          
          let data = [];
          x = x + 0.1;
          for(var i = 0; i < 1; i++) {
            data.push(Math.abs(100 * Math.sin(i*0.2 + x)));
          }
          console.log(data);
          //console.log(data);
          let dataBuffer = Buffer.from(data);
          client.publish('stream', dataBuffer);
        }, 4);
    }
  })
})
