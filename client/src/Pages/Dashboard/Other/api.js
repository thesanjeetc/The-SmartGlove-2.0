import openSocket from "socket.io-client";
import Config from "../ConfigFile";

let socket;
let callbacks = [];

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  socket = openSocket("http://127.0.0.1:8000");
} else {
  socket = openSocket(window.location.hostname);
}

socket.on("newData", sensorData => {
  callbacks.forEach(cb => {
    cb(null, sensorData);
  });
});

const onStateChange = updateStatus => {
  socket.on("connState", (state, batt) => {
    updateStatus(null, [state, batt]);
    console.log(state, batt);
  });
};

function readStream(cb) {
  // socket.on("newData", timestamp => cb(null, timestamp));
  callbacks.push(cb);
}

function startStream() {
  socket.emit("startStream", Config.streamInterval, Config.numSensors);
}

function stopStream() {
  socket.emit("stopStream");
}

function streamState(cb) {
  socket.on("startStream", state => {
    //startStream();
    cb(true);
  });
  socket.on("stopStream", state => {
    //stopStream();
    cb(false);
  });
}

export { readStream, startStream, stopStream, onStateChange, streamState };
