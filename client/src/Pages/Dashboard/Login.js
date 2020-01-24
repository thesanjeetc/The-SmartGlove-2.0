import React, { useState, useEffect } from "react";
import { Container, Tile, BaseComponent } from "./Components/Base";
import { MenuBar } from "./Components/Menu";
import { Overlay, ClickButton } from "./Components/Misc";
import { StatusContainer } from "./Components/Status";
import { Recordings } from "./Components/Recording";
import { joinRoom } from "./Other/api";
import BarChart from "./Graphs/BarChart";
import LineChart from "./Graphs/LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { StateHandler } from "./Other/api";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    joinRoom(props.roomID || "demo");
  }

  render() {
    return (
      <Container className="w-screen h-screen p-16">
        <Container className="loginForm m-auto">
          <Tile className="w-full h-full">
            <div className="m-auto">
              <div>
                <h1>The SmartGlove</h1>
                <div className="text-lg">
                  <div>
                    <p className="my-3">Username</p>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="p-4 rounded-lg"
                    ></input>
                  </div>
                  <div className="my-4">
                    <p className="my-3">Password</p>
                    <input
                      type="text"
                      placeholder="Hello World"
                      className="p-4 rounded-lg"
                    ></input>
                  </div>
                  <div>
                    <button className="controlButton px-24 rounded-lg py-4 bg-gray-300 text-xl font-bold">
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tile>
        </Container>
      </Container>
    );
  }
}

export default Login;
