import React from "react";
import { BaseComponent, Container, Tile } from "./Base";
import { Redirect } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdjust,
  faHome,
  faWaveSquare,
  faPhoneAlt,
  faMobileAlt,
  faSignOutAlt,
  faTools
} from "@fortawesome/free-solid-svg-icons";
import GlobalState from "../Globals";
import { Button, MenuButton } from "../Dashboard/Components/Misc";
import { StateHandler, EventHandler } from "../Dashboard/Other/api";
import { withRouter } from "react-router-dom";

const MenuBar = props => {
  let userDetails = JSON.parse(GlobalState.get("userDetails"));
  let opts = {
    home: {
      physio: (
        <div className="h-1/3 flex-1">
          <MenuButton
            icon={faSignOutAlt}
            selectedColor="bg-main"
            stateSync={false}
            stateName="Logout"
            callback={() => {
              GlobalState.delete("userDetails");
              GlobalState.delete("userID");
              GlobalState.delete("userType");
              props.history.push("/login");
            }}
          />
        </div>
      ),
      client: (
        <div className="h-1/3 flex-1">
          <MenuButton
            icon={faSignOutAlt}
            selectedColor="bg-main"
            stateSync={false}
            stateName="Logout"
            callback={() => {
              GlobalState.delete("userDetails");
              GlobalState.delete("userID");
              GlobalState.delete("userType");
              props.history.push("/login");
            }}
          />
          <MenuButton
            icon={faTools}
            selectedColor="bg-main"
            stateSync={false}
            stateName="Logout"
            callback={() => {
              props.history.push("/room/" + userDetails.roomID);
            }}
          />
        </div>
      )
    },
    dashboard: (
      <div className="h-1/3 flex-1">
        <MenuButton
          icon={faHome}
          stateSync={false}
          stateName="home"
          callback={() => {
            props.history.push("/home");
          }}
        />
        <MenuButton
          icon={faWaveSquare}
          selectedColor="bg-main"
          stateName="simulate"
        />
        <MenuButton icon={faPhoneAlt} />
        <MenuButton
          icon={faMobileAlt}
          stateName="overlay"
          stateSync={false}
          callback={state => {
            console.log("open");
            EventHandler.update("overlay", state);
          }}
        />
      </div>
    )
  };
  let userType = GlobalState.get("userType") == "true" ? "physio" : "client";
  let menu;
  if (props.page === undefined) {
    menu = opts["dashboard"];
  } else {
    menu = opts["home"][userType] || opts["dashboard"];
  }
  return (
    <BaseComponent
      baseClass="sm:flex hidden h-screen w-24 inline-flex flex-wrap bg-menu shadow-lg "
      dark="bg-dark-menu"
      light="bg-light-menu"
      {...props}
    >
      {menu}
      <div className="self-end">
        <MenuButton
          icon={faAdjust}
          onClick={() => {
            GlobalState.darkmode = !GlobalState.darkmode;
            localStorage.setItem("darkmode", GlobalState.darkmode.toString());
            props.pageRefresh();
          }}
        />
      </div>
    </BaseComponent>
  );
};

export default withRouter(MenuBar);
