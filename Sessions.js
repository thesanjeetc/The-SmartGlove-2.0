class Session {
  constructor(socket, roomID) {
    this.roomID = roomID;
    this.socket = socket;
    this.streamInterval = 20;
    this.numSensors = 12;
    this.dataStream;
    this.gloveData = [new Array(this.numSensors).fill(1)];
    this.lastData = new Array(this.numSensors).fill(1);
    this.x = 0;

    this.recordings = {};
    this.newRecording = [];
    this.currentRecording = [];
    this.recordingPos = 0;

    this.currentState = {
      simulate: true,
      streaming: false,
      gloveConnect: false,
      recording: false,
      batteryLevel: "-",
      elapsedTime: "-",
      recordings: this.recordings,
      currentPlay: false
    };

    this.stateHandler = {
      streaming: this.handleStreaming,
      recording: this.handleRecording,
      currentPlay: this.handleRecordPlay
    };

    this.socket.on("connection", client => {
      client.on("clientConnect", () => {
        setTimeout(() => {
          client.emit("stateSync", this.currentState);
        }, 400);

        client.on("stateChange", (state, newState) => {
          this.updateState(client, state, newState, true);
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
    // console.log(stateName, stateValue);
    this.handleStateChange(stateName, stateValue);
    broadcast
      ? socket.broadcast.emit("stateChange", stateName, stateValue)
      : socket.emit("stateChange", stateName, stateValue);
  }

  handleStateChange(state, value) {
    if (this.stateHandler[state] !== undefined) {
      this.stateHandler[state].call(this, value);
    }
  }

  handleStreaming(stateValue) {
    stateValue ? this.startStream() : this.stopStream();
    if (this.currentState["gloveConnect"]) {
      this.socket.to(this.glove).emit("streamState", stateValue);
    }
  }

  handleRecording(stateValue) {
    if (stateValue) {
      this.newRecording = [];
      this.updateState(this.socket, "streaming", true);
      this.updateState(this.socket, "currentPlay", false);
    } else {
      if (this.newRecording.length > 20) {
        this.recordings[
          Math.random()
            .toString(36)
            .substring(7)
        ] = {
          name: "Recording " + (Object.keys(this.recordings).length + 1),
          data: this.newRecording
        };
        this.updateState(this.socket, "recordings", this.recordings);
        this.updateState(this.socket, "currentPlay", false);
      }
    }
  }

  handleRecordPlay(stateValue) {
    if (stateValue) {
      this.currentRecording = this.recordings[stateValue]["data"];
      this.recordingPos = 0;
      this.updateState(this.socket, "streaming", true);
    }
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
        (this.time % 60);
      this.updateState(this.socket, "elapsedTime", this.formattedTime);
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

  getData() {
    let data;
    if (this.currentState["currentPlay"]) {
      data = this.currentRecording[this.recordingPos];
      this.recordingPos += 1;
      if (this.recordingPos > this.currentRecording.length - 1) {
        this.recordingPos = 0;
      }
    } else if (this.currentState["simulate"]) {
      data = this.simulateData();
    } else if (this.currentState["gloveConnect"]) {
      this.newData = this.gloveData.shift();
      data = this.newData === undefined ? this.lastData : this.newData;
    } else {
      data = new Array(this.numSensors).fill(1);
    }
    if (this.currentState["recording"]) {
      this.newRecording.push(data);
    }
    return data;
  }

  startStream() {
    this.stopStream();
    this.dataStream = setInterval(() => {
      this.socket.emit("stateChange", "sensorData", this.getData());
    }, this.streamInterval);
  }

  stopStream() {
    clearInterval(this.dataStream);
  }
}

module.exports = Session;
