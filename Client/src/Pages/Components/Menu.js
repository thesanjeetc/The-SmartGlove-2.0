import React from "react";
import { BaseComponent, Container, Tile } from "./Base";
import { Redirect } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdjust,
  faHome,
  faWaveSquare,
  faPhoneAlt,
  faQrcode,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import GlobalState from "../Globals";
import { Button, MenuButton } from "../Dashboard/Components/Misc";
import { StateHandler } from "../Dashboard/Other/StateHandler";

const MenuBar = props => {
  let options =
    props.page === undefined ? (
      <div className="h-1/3 flex-1">
        <MenuButton
          icon={faHome}
          stateName="home"
          callback={() => {
            return <Redirect to="/home" />;
          }}
        />
        <MenuButton
          icon={faWaveSquare}
          selectedColor="bg-main"
          stateName="simulate"
        />
        <MenuButton icon={faPhoneAlt} />
        <MenuButton
          icon={faQrcode}
          stateName="overlay"
          stateSync={false}
          callback={state => {
            StateHandler.update("overlay");
          }}
        />
      </div>
    ) : (
      <MenuButton icon={faSignOutAlt} selectedColor="bg-main" />
    );
  return (
    <BaseComponent
      baseClass="h-screen w-24 inline-flex flex-wrap bg-menu shadow-lg "
      dark="bg-dark-menu"
      light="bg-light-menu"
      {...props}
    >
      {options}
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

export { MenuBar };
