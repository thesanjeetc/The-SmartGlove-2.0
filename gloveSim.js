var io = require("socket.io-client");

class Glove {
  constructor(roomID, local = false) {
    this.roomID = roomID;
    this.batteryLevel = 100;
    this.timer = 0;
    this.streamInterval = 10;
    this.dataStream;

    var socket = io.connect(
      local
        ? "http://127.0.0.1:80/" + roomID
        : "https://thesmartglove.herokuapp.com/" + roomID,
      { query: { room: roomID }, reconnect: true }
    );

    socket.on("connect", () => {
      socket.emit("gloveConnect");
      setInterval(() => {
        socket.emit("batteryLevel", this.simulateBattery());
      }, 800);
    });

    socket.on("streamState", state => {
      if (state) {
        this.dataStream = setInterval(() => {
          socket.emit("sensorData", this.simulateData());
        }, this.streamInterval);
      } else {
        clearInterval(this.dataStream);
      }
    });
  }

  simulateData() {
    let sensorData = [];
    this.timer += 0.04;
    for (var i = 0; i < 12; i++) {
      sensorData.push(Math.abs(100 * Math.sin(i * 0.55 + this.timer)));
    }
    return sensorData;
  }

  simulateBattery() {
    this.batteryLevel -= 0.1;
    return Math.floor(this.batteryLevel);
  }
}

var args = process.argv.slice(2);

new Glove(args[0] || "", true);
