var express = require("express");
var path = require("path");
var app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(process.env.PORT || 8000);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

let dataStream;
let connState;
let streaming = false;
let batt = "-";
let roomID = "glove";

battlevel = "24%";

const simulateData = (client, interval) => {
  let x = 0;
  dataStream = setInterval(() => {
    let data = [];
    x = x + 0.06;
    for (var i = 0; i < 12; i++) {
      data.push(Math.abs(Math.sin(i * 0.2 + x))*100.);
    }
    //console.log(data);
    io.emit("newData", data);
  }, interval);
};

io.on("connection", client => {
  client.emit("connState", connState, batt);
  streaming ? client.emit("startStream") : client.emit("stopStream");
  client.on("startStream", (interval, numSensors) => {
    streaming = true;
    client.broadcast.emit("startStream");
    simulateData(client, interval);
  });

  client.on("stopStream", () => {
    // Cancel Stream
    streaming = false;
    client.broadcast.emit("stopStream");
    clearInterval(dataStream);
  });
});

const gloveConn = io.of("/" + roomID);
gloveConn.on("connection", socket => {
  //clearInterval(dataStream);
  connState = true;
  console.log("connected");
  io.emit("connState", connState, batt);

  // socket.on('gloveStream', (socket, data) => {
  //   simulateData(io, 20);
  // });

  // socket.on('realData', (socket, data) => {
  //   io.emit('newData', data);
  // });

  socket.on("disconnect", socket => {
    connState = false;
    batt = "-";
    io.emit("connState", connState, "-");
  });

  // socket.on('batteryLevel', (socket, level) => {
  //   connState = false;
  //   batt = level
  //   io.emit('connState', connState, batt);
  // });
});
