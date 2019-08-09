import React from "react";
import { Route } from "react-router-dom";

import Home from "./pages/Home.js";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ContactForm from "./components/ContactForm.js";
import Error from "./pages/Error";
// import AppBuilder from "./pages/Workflows.js";
import Account from './pages/Account.js';
// import "./App.scss";
import AppBuilder from "./pages/AppBuilder.js";
import Simulator from './pages/Simulator.js';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/contact" component={ContactForm} />
      <Route path="/error" component={Error} />
      <Route path="/workflows" component={AppBuilder}/>
      <Route path='/account' component={Account} />
      <Route path='/simulator' component={Simulator} />
    </div>
  );
}

export default App;
