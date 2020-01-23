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
    console.log("[LOCAL] State Update: " + state);
    if (this.stateCallbacks[state] !== undefined) {
      this.currentState[state] = value;
      this.stateCallbacks[state].forEach((callback, index) => {
        callback(value);
      });
    }
  }
}

class SyncStateHandler extends StateHandler {
  constructor(socket) {
    super();
    this.socket = socket;
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
    console.log("[LOCAL] State Update: " + state);
    console.log(sync);
    this.currentState[state] = value;
    sync
      ? this.socket.emit("stateChange", state, value)
      : super.update(state, value);
  }
}

export { StateHandler, SyncStateHandler };
