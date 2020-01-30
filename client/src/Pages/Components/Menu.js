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
  faVideo,
  faMobileAlt,
  faQrcode
} from "@fortawesome/free-solid-svg-icons";
import GlobalState from "../Globals";
import { Button, MenuButton } from "../Dashboard/Components/Misc";
import { StateHandler, EventHandler } from "../Dashboard/Other/api";

const MenuBar = props => {
  return (
    <BaseComponent
      baseClass="sm:flex hidden h-screen w-24 inline-flex flex-wrap bg-menu shadow-lg "
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
