import React, { useState } from "react";
import { Tile, Container } from "./Base";
import { Button, ClickButton } from "./Misc";
import {
  startStream,
  stopStream,
  onStateChange,
  streamState
} from "../Other/api";
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
        {props.stateValue}
      </p>
    </div>
  );
};

const StatusContainer = props => {
  const [status, setStatus] = useState(false, "-", "-");

  onStateChange((err, state) => {
    setStatus(state);
  });

  return (
    <Tile className="">
      <div className="w-full">
        <Indicator connected={status[0]} />
        <GloveState icon={faBatteryThreeQuarters} stateValue={status[1]} />
        <GloveState icon={faStopwatch} stateValue={status[1]} />
      </div>
      <div className="w-full flex flex-wrap self-end">
        <ClickButton
          icon={faPlay}
          clickedIcon={faPause}
          className="h-32 rounded-bl-lg"
          handleClick={paused => (paused ? stopStream() : startStream())}
          updateState={state => streamState(state)}
        />
        <ClickButton
          icon={faCircle}
          clickedIcon={faStop}
          className="h-32 rounded-br-lg"
          handleClick={clicked => console.log(clicked)}
          // updateState={state => streamState(state)}
        />
      </div>
    </Tile>
  );
};

export { StatusContainer };
