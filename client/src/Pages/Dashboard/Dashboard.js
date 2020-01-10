import React, { useState, useEffect } from "react";
import { Container, Tile, BaseComponent } from "./Components/Base";
import { MenuBar } from "./Components/Menu";
import { Overlay, ClickButton } from "./Components/Misc";
import { StatusContainer } from "./Components/Status";
import { joinRoom } from "./Other/api";
import BarChart from "./Graphs/BarChart";
import LineChart from "./Graphs/LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { StateHandler } from "./Other/api";

// Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";
// https://github.com/chartjs/Chart.js/issues/2437#issuecomment-216530491

const SessionContainer = props => {
  console.log(props.recordings);
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
          .map(([id, recording]) => {
            return (
              <Recording
                id={id}
                key={id}
                name={recording["name"]}
                selected={currentPlay == id ? true : false}
                callback={(id, selected) => {
                  if (selected) {
                    setCurrent(id);
                    StateHandler.update("currentPlay", id);
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
      onClick={event => {
        if (event.ctrlKey) {
          let newName = prompt("Name the Recording:");
          // setName(newName);
          StateHandler.update(props.id, newName);
        } else {
          setClicked(!clicked);
          props.callback(props.id, !clicked);
        }
      }}
    >
      <div className="font-mono bg-transparent h-full w-4/5 text-center text-md ">
        <p className="object-center my-6 py-1">
          {props.name.length > 17
            ? props.name.substring(0, 15) + "…"
            : props.name}
        </p>
      </div>
      <div className="bg-transparent h-full w-1/5 rounded-lg text-2xl">
        <div
          className="my-4 py-1 mx-2 "
          onClick={() =>
            window.confirm("Delete the recording '" + props.name + "'?")
          }
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    </BaseComponent>
  );
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    joinRoom(props.roomID || "demo");
  }

  render() {
    return (
      <Container className="w-screen h-screen">
        <MenuBar pageRefresh={() => this.setState({ refresh: true })} />
        <Container className="h-full flex-1 p-3">
          <Container className="sm:w-2/5 md:w-1/5 h-full w-full h-full p-4">
            <Container className="h-4/5 w-full z-50">
              <StatusContainer />
            </Container>
            <Container className="h-4/5 w-full pt-8">
              <Tile className="scroller p-3 ">
                <SessionContainer />
              </Tile>
            </Container>
          </Container>
          <Container className="sm:flex hidden h-full lg:w-2/5 w-3/5">
            <Container className="w-full h-2/5 block p-4">
              <Tile className="p-4">
                <LineChart />
              </Tile>
            </Container>
            <Container className="w-full w-3/5 h-2/5 block p-4 ">
              <Tile className="p-4">
                <BarChart />
              </Tile>
            </Container>
          </Container>
          <Container className="sm:flex hidden h-full lg:w-2/5 w-full p-4">
            <Tile className="p-4"></Tile>
          </Container>
        </Container>
        <Overlay />
      </Container>
    );
  }
}

export default Dashboard;
