var express = require("express");
var url = require("url");
var path = require("path");
var app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);
var Session = require("./Sessions");

server.listen(process.env.PORT || 80);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

let liveSessions = {};
liveSessions[""] = new Session(io, "");

io.on("connection", client => {
  let roomID = client.handshake.query["room"];
  console.log(roomID);
  if (liveSessions[roomID] === undefined) {
    let sessionSocket = io.of("/" + roomID);
    liveSessions[roomID] = new Session(sessionSocket, roomID);
  }
});
