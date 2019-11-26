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

let currentState = {
  simulate: true,
  streaming: false,
  conn: false,
  darkmode: true,
  recording: false,
  batteryLevel: "-",
  awesomeness: false,
  elapsedTime: "-"
};

// Object.entries(syncStates).forEach(([state, value], index) => {
//   console.log(state, value);
//   io.on(state, newState => {
//     syncStates.state = newState;
//     io.emit(state, newState);
//   });
// });

let x = true;
let dataStream;
let connState;
let streaming = true;
let batt = "-";
let roomID = "glove";

battlevel = "24%";

const simulateData = () => {
  let x = 0;
  dataStream = setInterval(newState => {
    let data = [];
    x = x + 0.06;

    for (var i = 0; i < 12; i++) {
      if (currentState["simulate"]) {
        data.push(Math.abs(100 * Math.sin(i * 0.2 + x)));
      } else {
        data.push(1);
      }
    }

    //console.log(data);
    io.emit("stateChange", "sensorData", data);
  }, 20);
};

io.on("connection", client => {
  // client.emit("connState", connState, batt);
  // client.emit("stateUpdate", syncStates);
  // streaming ? client.emit("startStream") : client.emit("stopStream");
  // setTimeout(() => {
  //   console.log("-----");
  //   Object.entries(syncStates).forEach(([state, value], index) => {
  //     client.emit(state, value);
  //     console.log(state, value);
  //   });
  //   console.log("-----");
  // }, 1000);
  setTimeout(() => {
    client.emit("stateSync", currentState);
  }, 400);

  client.on("stateChange", (state, newState) => {
    currentState[state] = newState;
    console.log(state);
    if (state == "streaming") {
      currentState[state] ? simulateData() : clearInterval(dataStream);
    }
    client.broadcast.emit("stateChange", state, newState);
  });
});

const glove = io.of("/" + roomID);
glove.on("connection", socket => {
  //clearInterval(dataStream);
  currentState.gloveConn = true;
  io.emit("gloveConnect", true);

  // socket.on('gloveStream', (socket, data) => {
  //   simulateData(io, 20);
  // });

  // socket.on('realData', (socket, data) => {
  //   io.emit('newData', data);
  // });

  socket.on("disconnect", socket => {
    currentState.gloveConn = false;
    io.emit("gloveConnect", false);
  });

  // socket.on('batteryLevel', (socket, level) => {
  //   connState = false;
  //   batt = level
  //   io.emit('connState', connState, batt);
  // });
});
