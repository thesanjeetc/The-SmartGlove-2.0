import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseComponent, Container, Tile } from "../../Components/Base";
import { StateHandler, EventHandler } from "../Other/api";
import { EventEmitter } from "../Other/StateHandler";

const Overlay = props => {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    EventHandler.subscribe("overlay", setClicked);
  }, []);
  let baseClass = ["w-screen overlay h-screen absolute z-50 flex"];
  return (
    <BaseComponent
      baseClass={clicked ? baseClass : [baseClass, "hidden"].join(" ")}
      onClick={() => {
        setClicked(!clicked);
        EventHandler.update("overlay", !clicked);
      }}
    >
      {props.children}
    </BaseComponent>
  );
};

const Button = props => {
  return (
    <BaseComponent {...props}>
      {props.icon ? (
        <div className="m-auto">
          <FontAwesomeIcon icon={props.icon} size={props.iconSize || "1x"} />
        </div>
      ) : (
        props.children
      )}
    </BaseComponent>
  );
};

const ClickButton = props => {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (props.stateSync === undefined) {
      StateHandler.subscribe(props.stateName, setClicked);
    } else {
      EventHandler.subscribe(props.stateName, setClicked);
    }
  }, []);
  return (
    <Button
      onClick={event => {
        setClicked(!clicked);
        if (props.stateSync === undefined) {
          StateHandler.update(props.stateName, !clicked);
        } else {
          EventHandler.update(props.stateName, !clicked);
        }
        if (props.callback) {
          props.callback(!clicked, event);
        }
      }}
      icon={clicked ? props.clickedIcon || props.icon : props.icon}
      iconSize={props.iconSize}
      className={props.className}
      baseClass={
        clicked
          ? [props.baseClass, props.selectedColor].join(" ") || props.baseClass
          : props.baseClass
      }
      children={props.children || ""}
    />
  );
};

const MenuButton = props => {
  if (props.stateName) {
    return (
      <ClickButton
        baseClass="menubutton bg-transparent w-24 h-24 inline flex"
        {...props}
      />
    );
  } else {
    return (
      <Button
        baseClass="menubutton bg-transparent w-24 h-24 inline flex"
        {...props}
      />
    );
  }
};

const ControlButton = props => {
  return (
    <ClickButton
      baseClass="controlButton w-1/2 bg-transparent block-inline content-center flex"
      iconSize="2x"
      {...props}
    />
  );
};

export { Button, ControlButton, MenuButton, ClickButton, Overlay };
