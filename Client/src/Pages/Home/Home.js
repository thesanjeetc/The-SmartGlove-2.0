import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../Components/Base";
import { MenuBar } from "../Components/Menu";
import { joinRoom, StateHandler } from "../Dashboard/Other/api";

class Home extends React.Component {
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
        <MenuBar
          pageRefresh={() => this.setState({ refresh: true })}
          page={"Home"}
        />
      </Container>
    );
  }
}

export default Home;
