var { EventEmitter, Timer, UID } = require("./Utils");
var Session = require("./Session");
var db = require("./InternalQueries");

class Glove {
  constructor(socket, stateHandler) {
    this.stateHandler = stateHandler;
    this.timer = new Timer(time =>
      this.stateHandler.update("elapsedTime", time)
    );

    this.handleConnect(socket);

    socket.on("batteryLevel", data => this.handleBatteryLevel(data));
    socket.on("sensorData", data => this.handleSensorData(data));
    socket.on("disconnect", data => this.handleDisconnect(data));
  }

  handleConnect(socket) {
    this.timer.start();
    this.stateHandler.glove = socket.id;
    this.stateHandler.update("gloveConnect", true);
  }

  handleBatteryLevel(data) {
    this.stateHandler.update("batteryLevel", data);
  }

  handleSensorData(data) {
    this.stateHandler.sensorData = data;
  }

  handleDisconnect(data) {
    this.timer.stop();
    this.stateHandler.update("elapsedTime", "-");
    this.stateHandler.update("gloveConnect", false);
    this.stateHandler.update("batteryLevel", "-");
  }
}

class Client {
  constructor(socket, stateHandler) {
    this.stateHandler = stateHandler;
    this.handleConnect(socket);

    socket.on("stateChange", data => this.handleStateChange(socket, data));
    socket.on("patientConnect", data => this.handlePatient(data));
    socket.on("clientConnect", data => this.handleDisconnect(data));
  }

  handleConnect(socket) {
    socket.join("web");
    setTimeout(() => {
      socket.emit("stateSync", this.stateHandler.currentState);
    }, 500);
  }

  handleStateChange(socket, data) {
    this.stateHandler.update(...data, socket);
  }

  handlePatient(data) {
    let now = new Date();
    this.sessionStart = now.getTime();
    db.createSession(this.stateHandler.sessionID, data);
  }

  handleDisconnect(data) {
    let now = new Date();
    let duration = now.getTime() - this.sessionStart;
    let sessionDuration = Math.ceil(duration / 60000);
    db.updateSession(this.stateHandler.sessionID, sessionDuration);
  }
}

class SessionManager extends EventEmitter {
  constructor(socket, roomID) {
    super();
    this.socket = socket;
    this.roomID = roomID;

    this.sessionID = UID();
    this.session = new Session(this.sessionID, this);

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

    socket.on("connection", client => {
      client.on("gloveConnect", () => new Glove(client, this));
      client.on("clientConnect", () => new Client(client, this));
    });
  }

  update(state, value, socket) {
    super.update(state, value);
    this.currentState[state] = value;
    socket
      ? socket.broadcast.to("web").emit("stateChange", state, value)
      : this.socket.to("web").emit("stateChange", state, value);
  }

  updateGlove(state, value) {
    this.socket.to(this.glove).emit(state, value);
  }

  getState(state) {
    return this.currentState[state];
  }
}

module.exports = SessionManager;
