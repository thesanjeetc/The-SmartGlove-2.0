import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Landing from "./Pages/Landing/Landing";
import "./Styles/index.css";
import "./Styles/tailwind.css";
import GlobalState from "./Pages/Dashboard/Globals";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";

if (localStorage.getItem("darkmode") === null) {
  localStorage.setItem("darkmode", "true");
} else {
  GlobalState.darkmode = localStorage.getItem("darkmode") === "true";
}

const routing = (
  <Router>
    <div>
      <Route path="/" exact component={Landing} />
      <Route path="/demo" component={Dashboard} />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
