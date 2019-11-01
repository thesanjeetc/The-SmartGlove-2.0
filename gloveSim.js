var io = require("socket.io-client");

let local = true;
var socket = io.connect(
  local
    ? "http://127.0.0.1:8000/glove"
    : "https://thesmartglove.herokuapp.com/glove",
  { reconnect: true }
);

// Add a connect listener

const simulateData = client => {
  let x = 0;
  dataStream = setInterval(() => {
    let data = [];
    x = x + 0.06;
    for (var i = 0; i < 12; i++) {
      data.push(Math.abs(100 * Math.sin(i * 0.4 + x)));
    }
    //console.log(data);
    console.log(data);
    client.emit("realData", data);
  }, 20);
};

socket.on("connect", function(data) {
  socket.emit("batteryLevel", 21);
  // socket.emit('gloveStream');
  // simulateData(socket);
});
