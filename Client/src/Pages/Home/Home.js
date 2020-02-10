import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../Components/Base";
import MenuBar from "../Components/Menu";
import GlobalState from "../Globals";
import { Table } from "./Table";
import { Search, ViewButton } from "./Search";
import { withRouter } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    if (GlobalState.get("userID") == undefined) {
      this.props.history.push("/login");
      this.loggedOut = true;
    } else {
      let userDetails = JSON.parse(GlobalState.get("userDetails"));
      console.log(GlobalState.get("userType"));
      console.log(userDetails);
      this.state = {
        index: -1,
        name: [userDetails.Forename, userDetails.Surname].join(" "),
        physioID: userDetails.physioID,
        clientID: userDetails.clientID,
        sessionID: NaN,
        userType: GlobalState.get("userType") == "true",
        error: false
      };

      this.state.path = this.state.userType
        ? "physioSessions"
        : "clientSessions";
      this.updateLinks();

      this.nextRoute();
      this.state.displayData = this.state.data;
    }
  }

  nextRoute() {
    this.updateLinks();
    this.state.index += 1;
    this.state.endpoint = this.routes[this.state.path][this.state.index];
    if (this.state.endpoint !== undefined) {
      this.fetchData(this.state.endpoint);
    } else {
      this.fetchRoom();
    }
  }

  fetchRoom() {
    fetch("http://" + window.location.hostname + this.links.clientRoom, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        let roomID = data[0].roomID;
        this.playRecording(roomID);
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  playRecording(roomID) {
    if (this.state.recordingID !== undefined) {
      this.props.history.push(
        "/room/" + roomID + "?recording=" + this.state.recordingID
      );
    } else {
      this.props.history.push("/room/" + roomID);
    }
  }

  fetchData(path) {
    fetch("http://" + window.location.hostname + path, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ data: data });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  updateLinks() {
    this.links = {
      physioClients: "/api/physio/" + this.state.physioID + "/clients",
      //prettier-ignore
      physioClientSessions: "/api/physio/" + this.state.physioID + "/sessions/" + this.state.clientID,
      physioSessions: "/api/physio/" + this.state.physioID + "/sessions",
      physioRecordings: "/api/physio/" + this.state.physioID + "/recordings",
      clientSessions: "/api/client/" + this.state.clientID + "/sessions",
      //prettier-ignore
      clientSessionRecordings: "/api/client/" + this.state.clientID + "/sessions/" + this.state.sessionID,
      clientRecordings: "/api/client/" + this.state.clientID + "/recordings",
      clientRoom: "/api/client/" + this.state.clientID + "/room"
    };

    this.routes = {
      physioClients: [this.links.physioClients],
      physioSessions: [
        this.links.physioSessions,
        this.links.clientSessionRecordings
      ],
      physioRecordings: [this.links.physioRecordings],
      clientSessions: [
        this.links.clientSessions,
        this.links.clientSessionRecordings
      ],
      clientRecordings: [this.links.clientRecordings]
    };
  }

  newView(view) {
    this.state.path = view;
    this.state.index = -1;
    this.nextRoute();
  }

  updatePath(record) {
    if (record.clientID !== undefined) this.state.clientID = record.clientID;
    if (record.sessionID !== undefined) this.state.sessionID = record.sessionID;
    if (record.physioID !== undefined) this.state.physioID = record.sessionID;
    if (record.recordingID !== undefined)
      this.state.recordingID = record.recordingID;
    this.nextRoute();
  }

  render() {
    if (!this.loggedOut) {
      return (
        <Container className="w-screen h-screen">
          <MenuBar
            pageRefresh={() => this.setState({ refresh: true })}
            page={"Home"}
          />
          <Container className="flex-grow h-full py-6 px-3">
            <Container className="w-1/4 h-full px-3">
              <Tile className="flex">
                <div className="w-full p-5">
                  <div className="font-mono text-2xl font-hairline text-center py-12">
                    <p>Hey there,</p>
                    <p className="nameColor">{this.state.name}.</p>
                  </div>
                  <Search
                    data={this.state.data}
                    callback={displayData => {
                      this.setState({ displayData: displayData });
                    }}
                  />
                  <div className="my-12 w-full ">
                    <ViewButton
                      name={"My Clients"}
                      display={!this.state.userType}
                      onClick={() => {
                        this.newView("physioClients");
                      }}
                    />
                    <ViewButton
                      name={"My Sessions"}
                      onClick={() => {
                        this.newView(
                          this.state.userType
                            ? "physioSessions"
                            : "clientSessions"
                        );
                      }}
                    />
                    <ViewButton
                      name={"My Recordings"}
                      onClick={() => {
                        this.newView(
                          this.state.userType
                            ? "physioRecordings"
                            : "clientRecordings"
                        );
                      }}
                    />
                  </div>
                </div>
              </Tile>
            </Container>
            <Container className="w-3/4 h-full px-3">
              <Tile className="p-8 overflow-y-scroll scroller">
                <Table
                  data={this.state.displayData}
                  callback={record => this.updatePath(record)}
                />
              </Tile>
            </Container>
          </Container>
        </Container>
      );
    } else {
      return <div></div>;
    }
  }
}

export default withRouter(Home);
