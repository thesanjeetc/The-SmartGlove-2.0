var express = require('express');
var path = require('path'); 
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 8000);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

let dataStream;

io.on('connection', (client) => {

  client.on('startStream', (interval, numSensors) => {
    let x = 0;
    dataStream = setInterval(() => {
      
      let data = [];
      x = x + 0.1;
      for(var i = 0; i < numSensors; i++) {
        data.push(100 * Math.sin(i*0.2 + x));
      }
      //console.log(data);
      client.emit('newData', data);
    }, interval);
  });

  client.on('stopStream', () => {
    // Cancel Stream
    clearInterval(dataStream);
  });
});