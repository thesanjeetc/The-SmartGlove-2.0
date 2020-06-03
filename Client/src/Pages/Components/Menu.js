import React from "react";
import { BaseComponent, Container, Tile } from "./Base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdjust,
  faHome,
  faWaveSquare,
  faPhoneAlt,
  faMobileAlt,
  faSignOutAlt,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import GlobalState from "../Globals";
import { Button, MenuButton } from "../Dashboard/Components/Button";
import { StateHandler, EventHandler } from "../Dashboard/Other/api";
import { withRouter } from "react-router-dom";

const MenuBar = (props) => {
  let userDetails = JSON.parse(GlobalState.get("userDetails"));
  let userType = GlobalState.get("userType") == "true";
  let logout = (
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
  );

  let dashboard = (
    <MenuButton
      icon={faTools}
      selectedColor="bg-main"
      stateSync={false}
      stateName="Dashboard"
      callback={() => {
        props.history.push("/room/" + userDetails.roomID);
      }}
    />
  );

  let defaultMenu = (
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

      <MenuButton
        icon={faPhoneAlt}
        selectedColor="bg-main"
        stateName="videoCall"
        callback={(state) => {
          StateHandler.update("videoCall", state, true);
        }}
      />
      <MenuButton
        icon={faMobileAlt}
        stateName="overlay"
        stateSync={false}
        callback={(state) => {
          EventHandler.update("overlay", state);
        }}
      />
    </div>
  );

  let menu;
  if (props.page === undefined) {
    menu = defaultMenu;
  } else {
    menu = (
      <div className="h-1/3 flex-1">
        {userType ? [logout] : [logout, dashboard]}
      </div>
    );
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
