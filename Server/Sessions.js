var { Stream, UID } = require("./Utils");
var db = require("./InternalQueries");
var StateHandler = require("./StateManager");
class Session {
  constructor(socket, roomID) {
    this.roomID = roomID;
    this.socket = socket;
    this.sessionID = UID();

    this.streamInterval = 25;
    this.numSensors = 8;
    this.sensorData;
    this.x = 0;

    this.recordings = [];
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
      recordings: [],
      currentPlay: false
    };

    this.ee = new StateHandler(this.socket, this);

    this.ee.subscribe("streaming", value => this.handleStreaming(value));
    this.ee.subscribe("recording", value => this.handleRecording(value));
    this.ee.subscribe("currentPlay", value => this.handleRecordPlay(value));
    //prettier-ignore
    this.ee.subscribe("recordingsUpdate", value =>this.handleRecordUpdate(value));
    this.ee.subscribe("simulate", value => this.handleSimulate(value));

    db.getRoomRecordings(this.roomID, recordings => {
      this.ee.update("recordings", recordings);
    });

    this.stream = new Stream(() => {
      this.ee.update("sensorData", this.getData());
    }, this.streamInterval);
  }

  handleSimulate(stateValue) {
    if (this.currentState["gloveConnect"]) {
      this.socket.to(this.glove).emit("streamState", !stateValue);
    }
  }

  handleStreaming(stateValue) {
    stateValue ? this.stream.start() : this.stream.stop();
  }

  handleRecordUpdate(stateValue) {
    if (stateValue.func == "rename") {
      db.updateRecording(stateValue.id, stateValue.name);
    } else {
      db.deleteRecording(stateValue.id);
      if ((this.currentState["currentPlay"] = stateValue.id)) {
        this.ee.update("currentPlay", false);
      }
    }

    setTimeout(() => {
      db.getRoomRecordings(this.roomID, recordings => {
        this.ee.update("recordings", recordings);
      });
    }, 400);
  }

  handleRecording(stateValue) {
    if (stateValue) {
      this.newRecording = [];
      this.ee.update("streaming", true);
      this.ee.update("currentPlay", false);
    } else {
      if (this.newRecording.length > 20) {
        let name =
          "Recording " +
          (Object.keys(this.currentState["recordings"]).length + 1);
        let data = { data: this.newRecording };
        //prettier-ignore
        db.createRecording(name, data, this.sessionID, (recordingID) => {
          this.newRecordingID = recordingID;
          
          let recording = {
            Name: name,
            recordingID: this.newRecordingID
          };

          this.currentState["recordings"].push(recording);
          this.ee.update("recordings", this.currentState["recordings"]);
          this.ee.update("currentPlay", false);
        
        });
      }
    }
  }

  handleRecordPlay(stateValue) {
    if (stateValue) {
      db.getRecording(stateValue, data => {
        this.currentRecording = data;
        this.recordingPos = 0;
        this.ee.update("streaming", true);
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

  recordingData() {
    let data = this.currentRecording[this.recordingPos];
    this.recordingPos += 1;
    if (this.recordingPos > this.currentRecording.length - 1) {
      this.recordingPos = 0;
    }

    return data;
  }

  getData() {
    let data;
    if (this.currentState["currentPlay"]) {
      data = this.recordingData();
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

    return data;
  }
}

module.exports = Session;
