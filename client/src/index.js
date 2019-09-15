import React from 'react';
import ReactDOM from 'react-dom';
import App from './Pages/Dashboard';
import Landing from './Pages/Landing';
import './Styles/index.css';
import './Styles/tailwind.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

const routing = (
    <Router>
      <div>
        <Route path="/" exact component={Landing} />
        <Route path="/demo" component={App} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'))
