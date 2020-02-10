import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../Components/Base";

const ViewButton = props => {
  let baseClass =
    "controlButton cursor-pointer rounded-lg p-4 h-16 w-full my-4";
  return (
    <BaseComponent
      baseClass={
        (props.display ? [baseClass, "hidden"].join(" ") : baseClass) ||
        props.baseClass
      }
      dark="text-white bg-dark-main"
      light="text-gray-600 bg-light-main"
      onClick={props.onClick}
    >
      <div className="font-mono bg-transparent text-center text-md my-1">
        <p>{props.name}</p>
      </div>
    </BaseComponent>
  );
};

const Search = props => {
  useEffect(() => {
    props.callback(props.data);
  }, [props.data]);
  return (
    <BaseComponent
      className="w-full rounded-lg"
      dark="bg-dark-menu"
      light="bg-light-menu"
    >
      <input
        className="w-full h-20 bg-transparent rounded-lg px-4 text-lg font-mono"
        placeholder="Search"
        onChange={event => {
          let searchInput = event.target.value.toLowerCase();
          let displayData = [];
          if (searchInput == "") {
            displayData = props.data;
          } else {
            props.data.forEach(element => {
              for (let [key, value] of Object.entries(element)) {
                let val = value.toString().toLowerCase();
                if (val.includes(searchInput)) {
                  displayData.push(element);
                  break;
                }
              }
            });
          }
          props.callback(displayData);
        }}
      ></input>
    </BaseComponent>
  );
};

export { ViewButton, Search };
