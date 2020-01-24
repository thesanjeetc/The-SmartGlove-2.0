import React, { useState, useEffect } from "react";
import { Container, Tile, BaseComponent } from "../Components/Base";
import { StateHandler } from "../Dashboard/Other/api";
import logo from "./thesmartglove.png";
import GlobalState from "../Globals";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    GlobalState.darkmode = true;
    localStorage.setItem("darkmode", GlobalState.darkmode.toString());
  }

  render() {
    return (
      <Container className="w-screen h-screen md:p-16 ">
        <Container className="loginForm m-auto">
          <Tile className="w-full h-full">
            <div className="m-auto h-full">
              <div>
                <img src={logo} alt="Logo" className="h-16 my-16" />
                <div className="text-lg font-mono -my-4">
                  <div>
                    <p className="my-3">Username</p>
                    <input
                      type="text"
                      placeholder="Luke Skywalker"
                      className="p-4 w-full rounded-lg -my-1 bg-dark-menu"
                    ></input>
                  </div>
                  <div className="my-6">
                    <p className="my-3 text-md">Password</p>
                    <input
                      type="text"
                      placeholder="Nooooooooo..."
                      className="p-4 w-full rounded-lg -my-1 bg-dark-menu"
                      type="password"
                    ></input>
                  </div>
                  <div className="w-full flex my-12">
                    <button className="controlButton px-24 bg-dark-main rounded-lg py-4 text-xl font-bold m-auto">
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
