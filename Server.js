var bodyParser = require("body-parser");
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var Session = require("./Server/Sessions");
var routes = require("./Server/Routes");
var cors = require("cors");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/", routes);
server.listen(process.env.PORT || 80);

let liveSessions = {};
let demoSession = new Session(io, "");

io.on("connection", client => {
  let roomID = client.handshake.query["room"];
  console.log("Connected: " + roomID);
  if (liveSessions[roomID] === undefined && roomID !== "") {
    let sessionSocket = io.of("/" + roomID);
    liveSessions[roomID] = new Session(sessionSocket, roomID);
  }
});
