class EventEmitter {
  constructor() {
    this.stateCallbacks = {};
  }

  subscribe(state, callback) {
    if (this.stateCallbacks[state] === undefined) {
      this.stateCallbacks[state] = [];
    }
    this.stateCallbacks[state].push(callback);
  }

  update(state, value) {
    console.log("Event Emitted: ", state, value);
    if (this.stateCallbacks[state] !== undefined) {
      this.stateCallbacks[state].forEach((callback, index) => {
        callback(value);
      });
    }
  }
}

class SyncStateHandler extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    this.currentState = {};
    this.setup();
  }

  setup() {
    this.socket.on("stateSync", newState => {
      this.syncStates(newState);
    });

    this.socket.on("stateChange", (state, value) => {
      console.log("[REMOTE] State Update: " + state);
      this.currentState[state] = value;
      super.update(state, value);
    });
  }

  syncStates(newState) {
    this.currentState = newState;
    Object.entries(this.currentState).forEach(([state, value], index) => {
      super.update(state, value);
    });
  }

  update(state, value, localSync = false) {
    console.log("[LOCAL] State Update: " + state);
    this.currentState[state] = value;
    this.socket.emit("stateChange", state, value);
    if (localSync) {
      super.update(state, value);
    }
  }
}

export { EventEmitter, SyncStateHandler };
