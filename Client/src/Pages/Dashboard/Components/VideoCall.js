import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../../Components/Base";
import { StateHandler, EventHandler } from "../Other/api";
import { HandVis } from "../Visualisation/hand";

const VideoContainer = props => {
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    StateHandler.subscribe("videoCall", setDisplay);
  }, []);
  let baseClass = "w-full w-3/5 h-3/5 block p-4 " + (display ? "" : "hidden");
  console.log("refresh");
  return (
    <Container className={baseClass}>
      <Tile className="p-4">
        <iframe
          src={
            "https://tokbox.com/embed/embed/ot-embed.js?embedId=3629fd94-6254-436f-b4aa-c17fb6fd116b&room=" +
            props.roomID +
            "&iframe=true&abc=" +
            Math.random()
          }
          width="100%"
          height="220px"
          scrolling="no"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          allow="microphone; camera"
        ></iframe>
      </Tile>
    </Container>
  );
};

export { VideoContainer };
