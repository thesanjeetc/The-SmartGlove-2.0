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
    localStorage.setItem("darkmode", GlobalState.darkmode);
  }

  checkLogin() {
    if (this.state.loggedIn) {
      let userType = this.state.userType;
      let userID = this.state.userID;
      fetch("/api/" + userType + "/" + userID, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          GlobalState.store("userDetails", JSON.stringify(data[0]));
          this.props.history.push("/home");
        })
        .catch(error => {
          this.setState({ incorrectLogin: true });
        });
    }
  }

  componentDidUpdate() {
    this.checkLogin();
  }

  login(event) {
    event.preventDefault();
    fetch("/api/auth", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.username.value,
        password: this.password.value
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        GlobalState.store("userID", data[0].userID);
        GlobalState.store("userType", data[0].UserType);
        let userID = data[0].userID;
        let userType = data[0].UserType ? "physio" : "client";
        this.setState({
          loggedIn: true,
          userID: userID,
          userType: userType
        });
      })
      .catch(error => {
        this.setState({
          incorrectLogin: true
        });
      });
  }

  render() {
    return (
      <Container className="w-screen h-screen md:p-16 ">
        <Container className="loginForm m-auto">
          <Tile className="w-full h-full ">
            <div className="m-auto h-full">
              <div>
                <img src={logo} alt="Logo" className="h-16 my-16" />
                <div className="text-lg font-mono -my-4">
                  <div>
                    <p className="my-3">Username</p>
                    <input
                      type="text"
                      placeholder="Luke Skywalker"
                      className={
                        this.state.incorrectLogin
                          ? "p-4 w-full rounded-lg -my-1 bg-dark-menu border border-red-600"
                          : "p-4 w-full rounded-lg -my-1 bg-dark-menu"
                      }
                      ref={username => (this.username = username)}
                    ></input>
                  </div>
                  <div className="my-6">
                    <p className="my-3 text-md">Password</p>
                    <input
                      type="text"
                      placeholder="Nooooooooo..."
                      className={
                        this.state.incorrectLogin
                          ? "p-4 w-full rounded-lg -my-1 bg-dark-menu border border-red-600"
                          : "p-4 w-full rounded-lg -my-1 bg-dark-menu"
                      }
                      ref={password => (this.password = password)}
                      type="password"
                    ></input>
                  </div>
                  <div className="w-full flex my-10">
                    <button
                      className="controlButton px-24 bg-dark-main rounded-lg py-4 text-xl font-bold m-auto"
                      onClick={event => this.login(event)}
                    >
                      Login
                    </button>
                  </div>
                  <div className="w-full flex text-sm -my-4">
                    <p
                      className="m-auto linkHover cursor-pointer"
                      onClick={event => {
                        this.username.value = "demo";
                        this.password.value = "demo";
                        this.login(event);
                      }}
                    >
                      Or try the demo.
                    </p>
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
