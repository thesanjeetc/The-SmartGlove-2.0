var { Stream, Timer } = require("./utils");

//server - 12, glove - 14
class Session {
  constructor(socket, roomID) {
    this.roomID = roomID;
    this.socket = socket;
    this.streamInterval = 20;
    this.numSensors = 12;
    this.gloveData = [new Array(this.numSensors).fill(1)];
    this.lastData = new Array(this.numSensors).fill(1);
    this.x = 0;

    this.recordings = {};
    this.newRecording = [];
    this.currentRecording = [];
    this.recordingPos = 0;

    this.timer = new Timer(time =>
      this.updateState(this.socket, "elapsedTime", time)
    );

    this.stream = new Stream(() => {
      this.updateState(this.socket, "sensorData", this.getData());
    }, this.streamInterval);

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
        client.join("web");
        setTimeout(() => {
          client.emit("stateSync", this.currentState);
        }, 400);

        client.on("stateChange", (state, newState) => {
          this.updateState(client, state, newState, true);
        });

        client.on("streamInterval", i => {
          this.stream.streamInterval = i;
        });
      });

      client.on("gloveConnect", () => {
        this.timer.start();
        this.updateState(this.socket, "gloveConnect", true);
        this.glove = client.id;

        client.on("batteryLevel", batteryLevel => {
          this.updateState(this.socket, "batteryLevel", batteryLevel);
        });

        client.on("sensorData", sensorData => {
          this.gloveData.push(sensorData);
        });

        client.on("disconnect", () => {
          this.timer.stop();
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
      ? socket.to("web").broadcast.emit("stateChange", stateName, stateValue)
      : socket.to("web").emit("stateChange", stateName, stateValue);
  }

  handleStateChange(state, value) {
    if (this.stateHandler[state] !== undefined) {
      this.stateHandler[state].call(this, value);
    }
  }

  handleStreaming(stateValue) {
    stateValue ? this.stream.start() : this.stream.stop();
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
      data = this.gloveData.shift();
      if (data === undefined) {
        data = this.lastData;
      } else {
        this.lastData = data;
      }
    } else {
      data = new Array(this.numSensors).fill(1);
    }
    if (this.currentState["recording"]) {
      this.newRecording.push(data);
    }
    return data;
  }
}

module.exports = Session;
