var { Stream, Timer } = require("./Utils");
var db = require("./InternalQueries");

//server - 12, glove - 14

class StateHandler {
  constructor() {
    this.callbacks = {};
  }

  subscribe(state, callback) {
    this.callbacks[state] = callback;
  }

  update(state, newState) {
    if (this.callbacks[state] !== undefined) {
      this.callbacks[state](newState);
    }
  }
}

class Session {
  constructor(socket, roomID) {
    this.roomID = roomID;
    this.socket = socket;
    this.sessionID = Math.floor(Math.random() * 1000000);
    this.streamInterval = 25;
    this.numSensors = 8;
    this.sensorData;
    this.x = 0;

    this.recordings = [];
    this.newRecording = [];
    this.currentRecording = [];
    this.recordingPos = 0;

    db.getRoomRecordings(this.roomID, recordings => {
      console.log(recordings);
      this.recordings = recordings;
      this.updateState(this.socket, "recordings", recordings);
    });

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
      currentPlay: this.handleRecordPlay,
      recordingsUpdate: this.handleRecordingUpdate
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

        client.on("patientConnect", clientID => {
          this.clientID = clientID;
          db.createSession(this.sessionID, this.clientID);
          let now = new Date();
          this.sessionStart = now.getTime();
        });

        client.on("disconnect", () => {
          let now = new Date();
          let sessionDuration = Math.ceil(
            (now.getTime() - this.sessionStart) / 60000
          );
          db.updateSession(this.sessionID, sessionDuration);
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
          this.sensorData = sensorData;
        });

        client.on("disconnect", () => {
          this.timer.stop();
          //this.updateState(this.socket, "elapsedTime", "-");
          this.updateState(this.socket, "gloveConnect", false);
          //this.updateState(this.socket, "batteryLevel", "-");
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

  handleRecordingUpdate(stateValue) {
    console.log(stateValue);
    if (stateValue.func == "rename") {
      db.updateRecording(stateValue.id, stateValue.name);
    } else {
      db.deleteRecording(stateValue.id);
      if ((this.currentState["currentPlay"] = stateValue.id)) {
        this.updateState(this.socket, "currentPlay", false);
      }
    }
    db.getRoomRecordings(this.roomID, recordings => {
      this.recordings = recordings;
      this.updateState(this.socket, "recordings", this.recordings);
    });
  }

  handleRecording(stateValue) {
    if (stateValue) {
      this.newRecording = [];
      this.updateState(this.socket, "streaming", true);
      this.updateState(this.socket, "currentPlay", false);
    } else {
      if (this.newRecording.length > 20) {
        let name = "Recording " + (Object.keys(this.recordings).length + 1);
        console.log(name);
        //prettier-ignore
        try{
        db.createRecording(name, { data: this.newRecording }, this.sessionID, (recordingID) => {
          this.newRecordingID = recordingID;
          
        let recording = {
          Name: name,
          recordingID: this.newRecordingID
        };
        console.log(recording);
        this.recordings.push(recording);
        this.updateState(this.socket, "recordings", this.recordings);
        this.updateState(this.socket, "currentPlay", false);
        
        });
        
      }catch{}
      }
    }
  }

  handleRecordPlay(stateValue) {
    if (stateValue) {
      db.getRecording(stateValue, data => {
        console.log(stateValue);
        this.currentRecording = data;
        // console.log(stateValue, data);
        this.recordingPos = 0;
        this.updateState(this.socket, "streaming", true);
      });
    }
  }

  simulateData() {
    let sensorData = [];
    this.x += 0.06;
    for (var i = 0; i < this.numSensors; i++) {
      sensorData.push(Math.abs(100 * Math.sin(i * 0.2 + this.x)).toFixed(3));
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
      data = this.sensorData;
    } else {
      data = new Array(this.numSensors).fill(1);
    }
    if (this.currentState["recording"]) {
      this.newRecording.push(data);
    }
    // console.log(data);
    return data;
  }
}

module.exports = Session;
