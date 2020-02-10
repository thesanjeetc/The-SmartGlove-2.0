import moment from "moment";
import React, { useState, useEffect } from "react";
import { BaseComponent, Container, Tile } from "../Components/Base";

const Row = props => {
  return (
    <tr
      className="rounded row"
      onClick={() => {
        props.callback(props.data);
      }}
    >
      {props.children}
    </tr>
  );
};

const Column = props => {
  return (
    <td className="h-16 columns p-0">
      <BaseComponent
        baseClass="py-4 px-8 h-full w-full"
        dark="bg-dark-main"
        light="bg-light-main"
      >
        {props.children}
      </BaseComponent>
    </td>
  );
};

const Header = props => {
  return (
    <td className="p-0">
      <BaseComponent
        baseClass="w-full h-full p-8"
        dark="bg-dark-menu"
        light="bg-light-menu"
      >
        {props.children}
      </BaseComponent>
    </td>
  );
};

const Table = props => {
  let tableData = [];
  try {
    let headers = [];
    Object.keys(props.data[0]).forEach((key, i) => {
      if (key.includes("ID")) return;
      headers.push(<Header key={i}>{key}</Header>);
    });
    tableData.push(<tr className="rounded rowhover">{headers}</tr>);
    props.data.forEach(element => {
      let row = [];
      Object.entries(element).forEach(([key, value], j) => {
        if (key.includes("ID")) return;
        if (key == "Timestamp") {
          value = moment(value).format("MM/DD/YYYY h:mm A");
        }
        row.push(<Column key={j}>{value}</Column>);
      });
      tableData.push(
        <Row
          data={element}
          callback={record => {
            props.callback(record);
          }}
        >
          {row}
        </Row>
      );
    });
  } catch {
    tableData.push(<p>No data found.</p>);
  }
  return <table className="w-full rounded font-mono">{tableData}</table>;
};

export { Table };
