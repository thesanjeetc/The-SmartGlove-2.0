import io from "socket.io-client";
import Config from "../ConfigFile";
import { SyncStateHandler } from "./StateHandler";

let socket;
let dev = false;
let devIP = "159.65.92.200";
let address = dev ? "http://" + devIP + ":8000" : "http://127.0.0.1:8000/";
let StateHandler;

const joinRoom = roomID => {
  if (!process.env.NODE_ENV === "development") {
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
