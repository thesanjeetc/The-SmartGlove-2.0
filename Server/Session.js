var { Stream } = require("./Utils");
var db = require("./InternalQueries");
class Session {
  constructor(sessionID, stateManager) {
    this.sessionID = sessionID;
    this.stateHandler = stateManager;

    this.streamInterval = 25;
    this.numSensors = 8;
    this.sensorData;
    this.x = 0;

    this.recordings = [];
    this.newRecording = [];
    this.currentRecording = [];
    this.recordingPos = 0;

    this.updateRecordings();

    this.stream = new Stream(() => {
      this.stateHandler.update("sensorData", this.getData());
    }, this.streamInterval);

    this.stateHandler.subscribe("streaming", value =>
      this.handleStreaming(value)
    );

    this.stateHandler.subscribe("recording", value =>
      this.handleRecording(value)
    );

    this.stateHandler.subscribe("currentPlay", value =>
      this.handleRecordPlay(value)
    );

    this.stateHandler.subscribe("recordingsUpdate", value =>
      this.handleRecordUpdate(value)
    );

    this.stateHandler.subscribe("simulate", value =>
      this.handleSimulate(value)
    );
  }

  handleSimulate(stateValue) {
    if (this.stateHandler.getState("gloveConnect")) {
      this.stateHandler.updateGlove("streamState", !stateValue);
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
      if (this.stateHandler.getState("currentPlay") === stateValue.id) {
        this.stateHandler.update("currentPlay", false);
      }
    }

    setTimeout(() => {
      this.updateRecordings();
    }, 400);
  }

  handleRecording(stateValue) {
    if (stateValue) {
      this.newRecording = [];
      this.stateHandler.update("streaming", true);
      this.stateHandler.update("currentPlay", false);
    } else {
      if (this.newRecording.length > 20) {
        let numRecordings = this.stateHandler.getState("recordings").length;
        let name = "Recording " + (numRecordings + 1);
        let data = { data: this.newRecording };

        db.createRecording(name, data, this.sessionID, () => {
          this.updateRecordings();
          this.stateHandler.update("currentPlay", false);
        });
      }
    }
  }

  handleRecordPlay(stateValue) {
    if (stateValue) {
      db.getRecording(stateValue, data => {
        this.currentRecording = data;
        this.recordingPos = 0;
        this.stateHandler.update("streaming", true);
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

  updateRecordings() {
    db.getRoomRecordings(this.stateHandler.roomID, recordings => {
      this.stateHandler.update("recordings", recordings);
    });
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
    if (this.stateHandler.getState("currentPlay")) {
      data = this.recordingData();
    } else if (this.stateHandler.getState("simulate")) {
      data = this.simulateData();
    } else if (this.stateHandler.getState("gloveConnect")) {
      data = this.stateHandler.sensorData;
    } else {
      data = new Array(this.numSensors).fill(1);
    }

    if (this.stateHandler.getState("recording")) {
      this.newRecording.push(data);
    }

    return data;
  }
}

module.exports = Session;
