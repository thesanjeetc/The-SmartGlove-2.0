import React from "react";
import {Container, Tile } from "./Components/Base";
import { MenuBar } from "./Components/Menu";
import { StatusContainer } from "./Components/Status";
import { startStream, stopStream, setup } from "./Other/api";
import BarChart from "./Graphs/BarChart";
import LineChart from "./Graphs/LineChart";

// Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";
// https://github.com/chartjs/Chart.js/issues/2437#issuecomment-216530491

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorData: new Array(10).fill(0),
      darkmode: true,
      connected: false,
      batteryLevel: "-",
      elapsedTime: "-"
    };

    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    startStream((err, datapoints) =>
      this.setState({
        sensorData: datapoints
      })
    );

    setup((err, conn, batt) => {
      this.setState({
        connected: conn,
        batteryLevel: batt
      });
    });
  }

  handleCheck() {
    this.setState({ simulate: !this.state.simulate });
    if (this.state.simulate) {
      startStream((err, datapoints) =>
        this.setState({
          sensorData: datapoints
        })
      );
    } else {
      stopStream();
    }
  }

  updateState(stateLabel, value) {
    this.setState({[stateLabel]: value });
  }

  render() {
    return (
      <Container className="w-screen h-screen">
        <MenuBar/>
        <Container className="h-full flex-1 p-3">
          <Container className="h-full lg:w-1/5 w-2/5 p-4">
            <Container className="h-4/5 w-full z-50">
              <StatusContainer connected={this.state.connected} />
            </Container>
            <Container className="h-4/5 w-full pt-8">
              <Tile className=""></Tile>
            </Container>
          </Container>
          <Container className="h-full lg:w-2/5 w-3/5">
            <Container className="w-full h-2/5 block p-4">
              <Tile className="p-4">
                <LineChart sensorData={this.state.sensorData} />
              </Tile>
            </Container>
            <Container className="w-full h-2/5 block p-4 ">
              <Tile className="p-4">
                <BarChart sensorData={this.state.sensorData} />
              </Tile>
            </Container>
          </Container>
          <Container className="h-full lg:w-2/5 w-full p-4">
            <Tile className="p-4"></Tile>
          </Container>
        </Container>
      </Container>
    );
  }
}

export default Dashboard;
