import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../../Components/Base";
import { Button, ClickButton, ControlButton } from "./Misc";
import { StateHandler } from "../Other/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdjust,
  faHome,
  faCircle,
  faStop,
  faPlay,
  faPause,
  faWaveSquare,
  faBatteryThreeQuarters,
  faStopwatch,
  faPhoneAlt,
  faVideo
} from "@fortawesome/free-solid-svg-icons";

const Indicator = props => {
  let animClasses = ["pulseAnim w-2 h-2"];
  let textClasses = ["text-base font-mono pl-5"];
  if (props.connected) {
    textClasses.push("connText");
    animClasses.push("connected");
  } else {
    textClasses.push("disText");
    animClasses.push("disconnected");
  }
  return (
    <div className="m-auto flex flex-wrap flex justify-center mt-12">
      <div className={animClasses.join(" ")}></div>
      <p className={textClasses.join(" ")}>
        {props.connected ? "Connected" : "Disconnected"}
      </p>
    </div>
  );
};

const GloveState = props => {
  return (
    <div className="w-full flex flex-wrap justify-center mt-4">
      <FontAwesomeIcon icon={props.icon} size="1x" />
      <p className="text-base font-mono inline ml-6 -mt-1">
        {props.stateValue + (props.stateValue == "-" ? "" : props.end || "")}
      </p>
    </div>
  );
};

const StatusContainer = props => {
  const [status, setStatus] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState("-");
  const [elapsedTime, setTime] = useState("-");

  useEffect(() => {
    StateHandler.subscribe("gloveConnect", setStatus);
    StateHandler.subscribe("batteryLevel", setBatteryLevel);
    StateHandler.subscribe("elapsedTime", setTime);
  }, []);

  return (
    <Tile className="">
      <div className="w-full">
        <Indicator connected={status} />
        <GloveState
          icon={faBatteryThreeQuarters}
          stateValue={batteryLevel}
          end="%"
        />
        <GloveState icon={faStopwatch} stateValue={elapsedTime} />
      </div>
      <div className="w-full flex flex-wrap self-end">
        <ControlButton
          icon={faPlay}
          clickedIcon={faPause}
          className="h-32 rounded-bl-lg"
          stateName="streaming"
        />
        <ControlButton
          icon={faCircle}
          clickedIcon={faStop}
          className="h-32 rounded-br-lg"
          stateName="recording"
        />
      </div>
    </Tile>
  );
};

export { StatusContainer };
