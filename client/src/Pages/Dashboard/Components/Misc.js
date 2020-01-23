import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseComponent, Container, Tile } from "./Base";
import { StateHandler } from "../Other/api";

const Overlay = props => {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    StateHandler.subscribe("overlay", setClicked);
  }, []);
  let baseClass = ["w-screen h-screen bg-gray-900 absolute z-50"];
  return (
    <BaseComponent
      baseClass={
        clicked
          ? [baseClass, "opacity-25"].join(" ")
          : [baseClass, "opacity-0 hidden"].join(" ")
      }
      onClick={() => {
        setClicked(!clicked);
        StateHandler.update("overlay", !clicked);
      }}
    />
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
    StateHandler.subscribe(props.stateName, setClicked);
  }, []);
  return (
    <Button
      onClick={event => {
        console.log(props.stateName);
        setClicked(!clicked);
        StateHandler.update(
          props.stateName,
          !clicked,
          props.stateSync ? false : true
        );
        console.log(clicked);
        try {
          props.callback(!clicked, event);
        } catch {}
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
