import React, { useState, useEffect } from "react";
import GlobalState from "../../Globals";
import QRCode from "qrcode";
import { BaseComponent, Container, Tile } from "../../Components/Base";
import { Overlay } from "./Misc";

const Code = props => {
  const [lightQR, setLight] = useState("");
  const [darkQR, setDark] = useState("");
  const themes = {
    light: { dark: "#718096", light: "#F7FAFC" },
    dark: { dark: "#F7FAFC", light: "#1C2138" }
  };
  useEffect(() => {
    let link = "http://thesmartglove.herokuapp.com/room/" + props.roomID;
    QRCode.toDataURL(link, { color: themes["light"] }, (err, url) => {
      setLight(url);
    });
    QRCode.toDataURL(link, { color: themes["dark"] }, (err, url) => {
      setDark(url);
    });
  }, []);
  return (
    <div>
      <img
        height="512"
        width="512"
        src={GlobalState.darkmode ? darkQR : lightQR}
      />
    </div>
  );
};

const QRDialog = props => {
  return (
    <Overlay>
      <Container className="w-1/3 h-1/3 m-auto bg-transparent">
        <Tile className="w-full h-full p-16">
          <Code roomID={props.roomID} />
        </Tile>
      </Container>
    </Overlay>
  );
};

export { QRDialog };
