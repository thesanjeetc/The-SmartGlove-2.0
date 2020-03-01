import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Landing from "./Pages/Landing/Landing";
import "./Styles/index.css";
import "./Styles/tailwind.css";
import GlobalState from "./Pages/Globals";
import { Route, BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

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
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
      <Route
        path="/room/:id"
        component={props => <Dashboard roomID={props.match.params.id} />}
      />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
serviceWorker.register();
