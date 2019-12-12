import io from "socket.io-client";
import Config from "../ConfigFile";
import { SyncStateHandler } from "./StateHandler";

let socket;
let address;
let dev = false;
let devIP = "159.65.92.200";
let StateHandler;

const joinRoom = roomID => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    address = dev ? "http://" + devIP + ":8000" : "http://127.0.0.1:8000/";
  } else {
    address = window.location.hostname;
  }

  let socket = io.connect(address + roomID, {
    query: { room: roomID },
    reconnect: true
  });

  socket.on("connect", () => {
    socket.emit("clientConnect");
  });

  StateHandler = new SyncStateHandler(socket);
};

export { StateHandler, joinRoom };
