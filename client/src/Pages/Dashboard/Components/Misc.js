import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseComponent, Container, Tile } from "./Base";
import { StateHandler } from "../Other/api";

const Button = props => {
  return (
    <BaseComponent {...props}>
      <div className="m-auto">
        <FontAwesomeIcon icon={props.icon} size={props.iconSize || "1x"} />
      </div>
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
      onClick={() => {
        setClicked(!clicked);
        StateHandler.update(props.stateName, !clicked);
        try {
          props.callback();
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

export { Button, ControlButton, MenuButton, ClickButton };
