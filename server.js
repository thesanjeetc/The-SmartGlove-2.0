var express = require("express");
const bodyParser = require("body-parser");
var path = require("path");
var app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);
var Session = require("./Sessions");

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const testFunc = (request, response) => {
  pool.query("SELECT * FROM test", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/testing", testFunc);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

server.listen(process.env.PORT || 80);

let liveSessions = {};
new Session(io, "");

io.on("connection", client => {
  let roomID = client.handshake.query["room"];
  console.log(roomID);
  if (liveSessions[roomID] === undefined && roomID !== "") {
    let sessionSocket = io.of("/" + roomID);
    liveSessions[roomID] = new Session(sessionSocket, roomID);
  }
});
