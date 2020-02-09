import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../Components/Base";
import MenuBar from "../Components/Menu";
import { joinRoom, StateHandler } from "../Dashboard/Other/api";
import GlobalState from "../Globals";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";
import moment from "moment";

const Row = props => {
  return (
    <tr
      className="rounded row"
      onClick={() => {
        props.callback(props.data);
      }}
    >
      {props.children}
    </tr>
  );
};

const Column = props => {
  return (
    <td className="h-16 columns p-0">
      <BaseComponent
        baseClass="py-4 px-8 h-full w-full"
        dark="bg-dark-main"
        light="bg-light-main"
      >
        {props.children}
      </BaseComponent>
    </td>
  );
};

const Header = props => {
  return (
    <td className="p-0">
      <BaseComponent
        baseClass="w-full h-full p-8"
        dark="bg-dark-menu"
        light="bg-light-menu"
      >
        {props.children}
      </BaseComponent>
    </td>
  );
};

const Table = props => {
  let tableData = [];
  try {
    let headers = [];
    Object.keys(props.data[0]).forEach((key, i) => {
      if (key.includes("ID")) return;
      headers.push(<Header key={i}>{key}</Header>);
    });
    tableData.push(<tr className="rounded rowhover">{headers}</tr>);
    props.data.forEach(element => {
      let row = [];
      Object.entries(element).forEach(([key, value], j) => {
        if (key.includes("ID")) return;
        if (key == "Timestamp") {
          value = moment(value).format("MM/DD/YYYY h:mm A");
        }
        row.push(<Column key={j}>{value}</Column>);
      });
      tableData.push(
        <Row
          data={element}
          callback={record => {
            props.callback(record);
          }}
        >
          {row}
        </Row>
      );
    });
  } catch {
    tableData.push(<p>No data found.</p>);
  }
  return <table className="w-full rounded font-mono">{tableData}</table>;
};

const ViewButton = props => {
  let baseClass =
    "controlButton cursor-pointer rounded-lg p-4 h-16 w-full my-4";
  return (
    <BaseComponent
      baseClass={
        (props.display ? [baseClass, "hidden"].join(" ") : baseClass) ||
        props.baseClass
      }
      dark="text-white bg-dark-main"
      light="text-gray-600 bg-light-main"
      onClick={props.onClick}
    >
      <div className="font-mono bg-transparent text-center text-md my-1">
        <p>{props.name}</p>
      </div>
    </BaseComponent>
  );
};

const Search = props => {
  useEffect(() => {
    props.callback(props.data);
  }, [props.data]);
  return (
    <BaseComponent
      className="w-full rounded-lg"
      dark="bg-dark-menu"
      light="bg-light-menu"
    >
      <input
        className="w-full h-20 bg-transparent rounded-lg px-4 text-lg font-mono"
        placeholder="Search"
        onChange={event => {
          let searchInput = event.target.value.toLowerCase();
          let displayData = [];
          if (searchInput == "") {
            displayData = props.data;
          } else {
            props.data.forEach(element => {
              for (let [key, value] of Object.entries(element)) {
                let val = value.toString().toLowerCase();
                if (val.includes(searchInput)) {
                  displayData.push(element);
                  break;
                }
              }
            });
          }
          props.callback(displayData);
        }}
      ></input>
    </BaseComponent>
  );
};

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
    this.props.history.push(
      "/room/" + roomID + "?recording=" + this.state.recordingID
    );
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
      physioClients: [
        this.links.physioClients,
        this.links.physioClientSessions,
        this.links.clientSessionRecordings
      ],
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
                      name={"My Clients"}
                      display={!this.state.userType}
                      onClick={() => {
                        this.newView("physioClients");
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
