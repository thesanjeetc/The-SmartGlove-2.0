var io = require("socket.io-client");

class Glove {
  constructor(local = true) {
    this.uid = "06f159e3";
    this.batteryLevel = 100;
    this.timer = 0;
    this.dataStream;

    var socket = io.connect(
      local
        ? "http://127.0.0.1:8000/glove"
        : "https://thesmartglove.herokuapp.com/glove",
      { reconnect: true }
    );

    socket.on("connect", () => {
      setInterval(() => {
        socket.emit("batteryLevel", this.simulateBattery());
      }, 1000);
    });

    socket.on("startStream", () => {
      this.dataStream = setInterval(() => {
        socket.emit("sensorData", this.simulateData());
      }, 20);
    });

    socket.on("stopStream", () => {
      clearInterval(this.dataStream);
    });
  }

  simulateData() {
    let sensorData = [];
    this.timer += 0.06;
    for (var i = 0; i < 12; i++) {
      sensorData.push(Math.abs(100 * Math.sin(i * 0.4 + this.timer)));
    }
    return sensorData;
  }

  simulateBattery() {
    this.batteryLevel -= 0.1;
    return Math.floor(this.batteryLevel);
  }
}

new Glove(false);
