import React from "react";
import { BaseComponent, Container, Tile } from "./Base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdjust,
  faHome,
  faPlay,
  faPause,
  faWaveSquare,
  faBatteryThreeQuarters,
  faStopwatch,
  faPhoneAlt,
  faVideo
} from "@fortawesome/free-solid-svg-icons";
import GlobalState from "../Globals";

const MenuButton = props => {
  return (
    <BaseComponent
      onClick={props.onClick}
      baseClass="menubutton bg-transparent w-24 h-24 inline flex"
      {...props}
    >
      <div className="m-auto">
        <FontAwesomeIcon icon={props.icon} />
      </div>
    </BaseComponent>
  );
};

const MenuBar = props => {
  return (
    <BaseComponent
      baseClass="h-screen w-24 inline-flex flex-wrap bg-menu shadow-lg "
      dark="bg-dark-menu"
      light="bg-light-menu"
      {...props}
    >
      <div className="h-1/3 flex-1">
        <MenuButton icon={faHome} />
        <MenuButton icon={faWaveSquare} />
        <MenuButton icon={faPhoneAlt} />
        <MenuButton icon={faVideo} />
      </div>
      <MenuButton
        icon={faAdjust}
        className="self-end"
        onClick={() => {
          GlobalState.darkmode = !GlobalState.darkmode;
          localStorage.setItem("darkmode", GlobalState.darkmode.toString());
          props.pageRefresh();
        }}
      />
    </BaseComponent>
  );
};

export { MenuBar };
