import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../Components/Base";
import MenuBar from "../Components/Menu";
import { StatusContainer } from "./Components/Status";
import { Recordings } from "./Components/Recording";
import { QRDialog } from "./Components/QRCode";
import { joinRoom } from "./Other/api";
import BarChart from "./Graphs/BarChart";
import LineChart from "./Graphs/LineChart";
import { StateHandler } from "./Other/api";
import { HandVis } from "./Visualisation/hand";
import GlobalState from "../Globals";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    let params = queryString.parse(this.props.location.search);
    let roomID = props.roomID === "7cd34a" ? "" : props.roomID || "demo";
    if (params.device == "mobile") {
      joinRoom(roomID);
    } else {
      if (GlobalState.get("userID") == undefined) {
        this.props.history.push("/login");
        this.loggedOut = true;
      } else {
        this.userDetails = JSON.parse(GlobalState.get("userDetails"));
        let userType = !(GlobalState.get("userType") === "true");
        userType
          ? joinRoom(roomID, this.userDetails.clientID)
          : joinRoom(roomID);

        if (params.recording !== undefined)
          StateHandler.update("currentPlay", params.recording);
      }
    }
  }

  render() {
    if (!this.loggedOut) {
      return (
        <Container className="w-screen h-screen overflow-hidden">
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
            <Container className="sm:flex hidden h-full lg:w-2/5 w-full p-4">
              <Tile className="p-4">
                <HandVis />
              </Tile>
            </Container>
          </Container>
          <QRDialog roomID={this.props.roomID + "?device=mobile"} />
        </Container>
      );
    } else {
      return <div></div>;
    }
  }
}

export default withRouter(Dashboard);
