var { EventEmitter, Timer } = require("./Utils");
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
    this.stateHandler.updateAttr("glove", socket.id);
    this.stateHandler.update("gloveConnect", true);
  }

  handleBatteryLevel(data) {
    this.stateHandler.update("batteryLevel", data);
  }

  handleSensorData(data) {
    this.stateHandler.updateAttr("sensorData", data);
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
    }, 400);
  }

  handleStateChange(socket, data) {
    this.stateHandler.update(...data, socket);
  }

  handlePatient(data) {
    let now = new Date();
    this.sessionStart = now.getTime();
    db.createSession(this.stateHandler.getAttr("sessionID"), data);
  }

  handleDisconnect(data) {
    let now = new Date();
    let duration = now.getTime() - this.sessionStart;
    let sessionDuration = Math.ceil(duration / 60000);
    db.updateSession(this.stateHandler.getAttr("sessionID"), sessionDuration);
  }
}

class StateManager extends EventEmitter {
  constructor(socket, session) {
    super();

    this.session = session;
    this.socket = socket;
    this.currentState = session.currentState;

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

  updateAttr(name, value) {
    this.session[name] = value;
  }

  getAttr(name) {
    return this.session[name];
  }
}

module.exports = StateManager;
