import openSocket from "socket.io-client";
import Config from "../ConfigFile";

let socket;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  socket = openSocket("http://127.0.0.1:8000");
} else {
  socket = openSocket(window.location.hostname);
}

let currentState = {};
let stateCallbacks = {};

//Syncs global state on page load
socket.on("stateSync", newStates => {
  currentState = newStates;
  Object.entries(currentState).forEach(([state, value], index) => {
    try {
      stateCallbacks[state].forEach(callback => {
        callback(value);
      });
    } catch {}
  });
});

//Stores callbacks to notify components of state changes
const syncState = (state, callback) => {
  try {
    stateCallbacks[state].push(callback);
  } catch {
    stateCallbacks[state] = [];
    stateCallbacks[state].push(callback);
  }
};

//On remote change of state, updates corresponding component
socket.on("stateChange", (state, newState) => {
  currentState.state = newState;
  stateCallbacks[state].forEach((callback, index) => {
    callback(newState);
  });
});

//On local change of state, notifies server of state change
const stateUpdate = (state, newState) => {
  currentState.state = newState;
  socket.emit("stateChange", state, newState);
};

export { syncState, stateUpdate };
