import io from "socket.io-client";
import Config from "../../ConfigFile";
import { EventEmitter, SyncStateHandler } from "./StateHandler";

let dev = false;
let devIP = "159.65.92.200";
let address;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  address = window.location.hostname + "/";
} else {
  address = "https://thesmartglove.herokuapp.com/";
}

let StateHandler;
let EventHandler = new EventEmitter();

const joinRoom = (roomID, id) => {
  let socket = io.connect(address + roomID, {
    query: { room: roomID },
    reconnect: true,
  });

  socket.on("connect", () => {
    socket.emit("clientConnect");
    if (id !== undefined) socket.emit("patientConnect", id);
  });

  StateHandler = new SyncStateHandler(socket);
};

export { StateHandler, EventHandler, joinRoom };
