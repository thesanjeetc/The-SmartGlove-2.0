import React, { useState } from "react";
import { Container, Tile } from "./Components/Base";
import { MenuBar } from "./Components/Menu";
import { StatusContainer } from "./Components/Status";
import BarChart from "./Graphs/BarChart";
import LineChart from "./Graphs/LineChart";
import { HandVis } from "./Visualisation/hand";

// Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";
// https://github.com/chartjs/Chart.js/issues/2437#issuecomment-216530491

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container className="w-screen h-screen">
        <MenuBar pageRefresh={() => this.setState({ refresh: true })} />
        <Container className="h-full flex-1 p-3">
          <Container className="h-full lg:w-1/5 w-2/5 p-4">
            <Container className="h-4/5 w-full z-50">
              <StatusContainer />
            </Container>
            <Container className="h-4/5 w-full pt-8">
              <Tile className=""></Tile>
            </Container>
          </Container>
          <Container className="h-full lg:w-2/5 w-3/5">
            <Container className="w-full h-2/5 block p-4">
              <Tile className="p-4">
                <LineChart />
              </Tile>
            </Container>
            <Container className="w-full h-2/5 block p-4 ">
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
      </Container>
    );
  }
}

export default Dashboard;
