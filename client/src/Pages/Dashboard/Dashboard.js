import React, { useState, useEffect } from "react";
import { Container, Tile, BaseComponent } from "./Components/Base";
import { MenuBar } from "./Components/Menu";
import { Overlay, ClickButton } from "./Components/Misc";
import { StatusContainer } from "./Components/Status";
import { SessionContainer } from "./Components/Recording";
import { joinRoom } from "./Other/api";
import BarChart from "./Graphs/BarChart";
import LineChart from "./Graphs/LineChart";

// Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";
// https://github.com/chartjs/Chart.js/issues/2437#issuecomment-216530491

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    let roomID = props.roomID === "bigbang" ? "" : props.roomID || "demo";
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
