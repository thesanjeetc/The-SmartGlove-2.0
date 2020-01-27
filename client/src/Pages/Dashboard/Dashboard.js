import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../Components/Base";
import { MenuBar } from "../Components/Menu";
import { Overlay, ClickButton } from "./Components/Misc";
import { StatusContainer } from "./Components/Status";
import { Recordings } from "./Components/Recording";
import { joinRoom } from "./Other/api";
import BarChart from "./Graphs/BarChart";
import LineChart from "./Graphs/LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { StateHandler } from "./Other/api";
import { HandVis } from "./Visualisation/hand";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    let roomID = props.roomID === "bigbang" ? "" : props.roomID || "demo";
    console.log("RoomID: " + roomID);
    joinRoom(roomID);
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
                <Recordings />
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
          <Container className="h-full lg:w-2/5 w-full p-4">
            <Tile className="p-4">
              <HandVis />
            </Tile>
          </Container>
        </Container>
        <Overlay />
      </Container>
    );
  }
}

export default Dashboard;
