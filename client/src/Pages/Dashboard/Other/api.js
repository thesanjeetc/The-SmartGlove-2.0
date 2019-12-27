import io from "socket.io-client";
import Config from "../ConfigFile";
import { SyncStateHandler } from "./StateHandler";

let dev = false;
let devIP = "159.65.92.200";
let address = (dev ? devIP : window.location.hostname) + "/";

let StateHandler;

const joinRoom = roomID => {
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
