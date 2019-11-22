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
import { Button, MenuButton } from "./Misc";

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
        <MenuButton
          icon={faWaveSquare}
          selectedColor="bg-main"
          stateName="simulate"
        />
        <MenuButton icon={faPhoneAlt} />
        <MenuButton icon={faVideo} />
      </div>
      <MenuButton
        icon={faAdjust}
        className="self-end menuButton"
        onClick={() => {
          GlobalState.darkmode = !GlobalState.darkmode;
          localStorage.setItem("darkmode", GlobalState.darkmode.toString());
          props.pageRefresh();
          console.log("hi");
        }}
      />
    </BaseComponent>
  );
};

export { MenuBar };
