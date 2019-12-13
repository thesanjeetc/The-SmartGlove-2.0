class Session {
  constructor(socket, roomID) {
    this.roomID = roomID;
    this.socket = socket;

    this.currentState = {
      simulate: true,
      streaming: false,
      gloveConnect: false,
      darkmode: true,
      recording: false,
      batteryLevel: "-",
      awesomeness: false,
      elapsedTime: "-"
    };

    this.streamInterval = 20;
    this.numSensors = 12;
    this.dataStream;
    this.gloveData = [new Array(this.numSensors).fill(1)];
    this.lastData = new Array(this.numSensors).fill(1);

    this.socket.on("connection", client => {
      client.on("clientConnect", () => {
        setTimeout(() => {
          client.emit("stateSync", this.currentState);
        }, 400);

        client.on("stateChange", (state, newState) => {
          this.updateState(client, state, newState, true);

          if (state == "streaming") {
            newState ? this.startStream() : this.stopStream();

            if (this.currentState["gloveConnect"]) {
              this.socket.to(this.glove).emit("streamState", newState);
            }
          }
        });
      });

      client.on("gloveConnect", () => {
        this.startTimer();
        this.updateState(this.socket, "gloveConnect", true);
        this.glove = client.id;

        client.on("batteryLevel", batteryLevel => {
          this.updateState(this.socket, "batteryLevel", batteryLevel);
        });

        client.on("sensorData", sensorData => {
          this.gloveData.push(sensorData);
        });

        client.on("disconnect", () => {
          this.stopTimer();
          this.updateState(this.socket, "elapsedTime", "-");
          this.updateState(this.socket, "gloveConnect", false);
          this.updateState(this.socket, "batteryLevel", "-");
        });
      });
    });
  }

  updateState(socket, stateName, stateValue, broadcast = false) {
    this.currentState[stateName] = stateValue;
    broadcast
      ? socket.broadcast.emit("stateChange", stateName, stateValue)
      : socket.emit("stateChange", stateName, stateValue);
  }

  startTimer() {
    this.time = 0;
    this.timer = setInterval(() => {
      this.time += 1;
      this.minutes = Math.floor(this.time / 60);
      this.formattedTime =
        (this.minutes < 10 ? "0" : "") +
        this.minutes +
        ":" +
        (this.time < 10 ? "0" : "") +
        this.time;
      this.currentState["elapsedTime"] = this.formattedTime;
      this.socket.emit("stateChange", "elapsedTime", this.formattedTime);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  simulateData() {
    let sensorData = [];
    this.x += 0.06;
    for (var i = 0; i < this.numSensors; i++) {
      sensorData.push(Math.abs(100 * Math.sin(i * 0.2 + this.x)));
    }
    return sensorData;
  }

  startStream() {
    let data;
    this.x = 0;
    this.dataStream = setInterval(() => {
      if (this.currentState["simulate"]) {
        data = this.simulateData();
      } else if (this.currentState["gloveConnect"]) {
        this.newData = this.gloveData.shift();
        data = this.newData === undefined ? this.lastData : this.newData;
      } else {
        data = new Array(this.numSensors).fill(1);
      }
      this.socket.emit("stateChange", "sensorData", data);
    }, this.streamInterval);
  }

  stopStream() {
    clearInterval(this.dataStream);
  }
}

module.exports = Session;
