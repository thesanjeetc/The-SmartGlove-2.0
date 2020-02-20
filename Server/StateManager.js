var { Timer } = require("./Utils");
var db = require("./InternalQueries");

class EventEmitter {
  constructor(socket) {
    this.callbacks = {};
    this.socket = socket;
  }

  subscribe(state, callback) {
    if (this.callbacks[state] === undefined) {
      this.callbacks[state] = callback;
      this.socket.on(state, (...data) => {
        callback([this.socket, data]);
      });
    }
  }
}

class Glove {
  constructor(socket, stateHandler) {
    this.stateHandler = stateHandler;
    this.timer = new Timer(time =>
      this.stateHandler.update("elapsedTime", time)
    );

    this.handleConnect(socket);

    let ee = new EventEmitter(socket);
    ee.subscribe("batteryLevel", params => this.handleBatteryLevel(...params));
    ee.subscribe("sensorData", params => this.handleSensorData(...params));
    ee.subscribe("disconnect", params => this.handleDisconnect(...params));
  }

  handleConnect(socket, data) {
    this.timer.start();
    this.stateHandler.updateAttr("glove", socket.id);
    this.stateHandler.update("gloveConnect", true);
  }

  handleBatteryLevel(socket, data) {
    this.stateHandler.update("batteryLevel", data);
  }

  handleSensorData(socket, data) {
    this.stateHandler.updateAttr("sensorData", data[0]);
  }

  handleDisconnect(socket, data) {
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

    let ee = new EventEmitter(socket);
    ee.subscribe("stateChange", params => this.handleStateChange(...params));
    ee.subscribe("patientConnect", params => this.handlePatient(...params));
    ee.subscribe("clientConnect", params => this.handleDisconnect(...params));
  }

  handleConnect(socket, data) {
    socket.join("web");
    setTimeout(() => {
      socket.emit("stateSync", this.stateHandler.currentState);
    }, 400);
  }

  handleStateChange(socket, [state, newState]) {
    this.stateHandler.update(state, newState, true);
  }

  handlePatient(socket, data) {
    let now = new Date();
    this.sessionStart = now.getTime();
    db.createSession(this.stateHandler.getAttr("sessionID"), data[0]);
  }

  handleDisconnect(socket, data) {
    let now = new Date();
    let duration = now.getTime() - this.sessionStart;
    let sessionDuration = Math.ceil(duration / 60000);
    db.updateSession(this.stateHandler.getAttr("sessionID"), sessionDuration);
  }
}

class StateHandler {
  constructor(socket, session) {
    socket.on("connection", client => {
      client.on("gloveConnect", () => new Glove(client, this));
      client.on("clientConnect", () => new Client(client, this));
    });

    this.session = session;
    this.socket = socket;
    this.callbacks = {};
    this.currentState = session.currentState;
  }

  handle(state, value) {
    this.currentState[state] = value;
    if (this.callbacks[state] !== undefined) {
      this.callbacks[state](value);
    }
  }

  subscribe(state, callback) {
    if (this.callbacks[state] === undefined) {
      this.callbacks[state] = callback;
    }
  }

  update(state, value) {
    this.handle(state, value);
    this.socket.to("web").emit("stateChange", state, value);
  }

  updateAttr(name, value) {
    this.session[name] = value;
  }

  getAttr(name) {
    return this.session[name];
  }
}

module.exports = StateHandler;
