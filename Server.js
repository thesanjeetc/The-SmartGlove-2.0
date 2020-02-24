var bodyParser = require("body-parser");
var app = require("express")();
var path = require("path");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var SessionManager = require("./Server/SessionManager.js");
var routes = require("./Server/Routes");
var express = require("express");
var { wakeUpDyno } = require("./Server/Utils");

app.use(express.static(path.join(__dirname, "Client/build")));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use("/api", routes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/Client/build/index.html"));
});

server.listen(process.env.PORT || 80, () => {
  wakeUpDyno();
});

let liveSessions = {};
let demoSession = new SessionManager(io, "7cd34a");

io.on("connection", client => {
  let roomID = client.handshake.query["room"];
  if (liveSessions[roomID] === undefined && roomID !== "") {
    let sessionSocket = io.of("/" + roomID);
    liveSessions[roomID] = new SessionManager(sessionSocket, roomID);
  }
});
