import openSocket from "socket.io-client";
import Config from "../ConfigFile";
import { SyncStateHandler } from "./StateHandler";

let StateHandler = new SyncStateHandler();

export { StateHandler };
