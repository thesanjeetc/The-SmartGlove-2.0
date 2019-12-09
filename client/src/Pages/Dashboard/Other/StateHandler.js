import openSocket from "socket.io-client";

class StateHandler {
  constructor() {
    this.currentState = {};
    this.stateCallbacks = {};
  }

  subscribe(state, callback) {
    if (this.stateCallbacks[state] === undefined) {
      this.stateCallbacks[state] = [];
    }
    this.stateCallbacks[state].push(callback);
  }

  update(state, value) {
    if (this.stateCallbacks[state] !== undefined) {
      this.currentState[state] = value;
      this.stateCallbacks[state].forEach((callback, index) => {
        callback(value);
      });
    }
  }
}

class SyncStateHandler extends StateHandler {
  constructor() {
    super();

    let dev = true
    let devIP = "159.65.92.200";
    
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      if(dev){
        this.socket = openSocket("http://" + devIP + ":8000");
      } else {
        this.socket = openSocket("http://127.0.0.1:8000");
      }
    } else {
      this.socket = openSocket(window.location.hostname);
    }

    this.setup();
  }

  setup() {
    this.socket.on("stateSync", newState => {
      this.syncStates(newState);
    });

    this.socket.on("stateChange", (state, value) => {
      super.update(state, value);
    });
  }

  syncStates(newState) {
    this.currentState = newState;
    Object.entries(this.currentState).forEach(([state, value], index) => {
      super.update(state, value);
    });
  }

  update(state, value, sync = true) {
    this.currentState[state] = value;
    sync
      ? this.socket.emit("stateChange", state, value)
      : super.update(state, value);
  }
}

export { StateHandler, SyncStateHandler };
