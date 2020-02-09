import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../../Components/Base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { StateHandler } from "../Other/api";

const SessionContainer = props => {
  const [currentPlay, setCurrent] = useState(false);
  const [recordings, setRecordings] = useState({});
  useEffect(() => {
    StateHandler.subscribe("currentPlay", setCurrent);
    StateHandler.subscribe("recordings", setRecordings);
  }, []);
  return (
    <div className="w-full h-full">
      <div className="text-center w-full">
        <p className="font-mono px-8 py-4 ">Your Recordings</p>
      </div>
      <BaseComponent
        baseClass="w-full sessionContainer overflow-y-scroll scroller px-2"
        dark="scrollerDark"
        light="scrollerLight"
      >
        {Object.entries(recordings)
          .map(([x, recording]) => {
            console.log(recording);
            return (
              <Recording
                id={recording["recordingID"]}
                key={recording["recordingID"]}
                name={recording["Name"]}
                selected={
                  currentPlay == recording["recordingID"] ? true : false
                }
                callback={(id, selected) => {
                  if (selected) {
                    setCurrent(id);
                    StateHandler.update(
                      "currentPlay",
                      recording["recordingID"]
                    );
                  } else {
                    setCurrent(false);
                    StateHandler.update("currentPlay", false);
                  }
                }}
              />
            );
          })
          .reverse()}
      </BaseComponent>
    </div>
  );
};

const Recording = props => {
  // const [name, setName] = useState("Test Recording");
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    // StateHandler.subscribe(props.id, setName);
  }, []);
  let baseClass = "controlButton x w-full h-20 my-2 rounded-lg flex";
  return (
    <BaseComponent
      baseClass={
        props.selected ? [baseClass, "recordSelect"].join(" ") : baseClass
      }
      dark="text-white bg-dark-main"
      light="text-gray-600 bg-light-main"
      key={props.id}
    >
      <div
        className="font-mono bg-transparent h-full w-4/5 text-center text-md "
        onClick={event => {
          if (event.ctrlKey) {
            event.preventDefault();
            let newName = prompt("Name the Recording:");
            // setName(newName);
            StateHandler.update("recordingsUpdate", {
              id: props.id,
              func: "rename",
              name: newName
            });
          } else {
            setClicked(!clicked);
            props.callback(props.id, !clicked);
          }
        }}
      >
        <p className="object-center my-6 py-1">
          {props.name.length > 17
            ? props.name.substring(0, 15) + "…"
            : props.name}
        </p>
      </div>
      <div className="bg-transparent h-full w-1/5 rounded-lg text-2xl">
        <div
          className="my-4 py-1 mx-2 "
          onClick={() => {
            if (window.confirm("Delete the recording '" + props.name + "'?")) {
              StateHandler.update("recordingsUpdate", {
                id: props.id,
                func: "delete"
              });
            }
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    </BaseComponent>
  );
};

export { SessionContainer as Recordings };
