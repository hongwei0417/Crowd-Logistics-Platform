import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "firebase/database";
import "./App.css";
import Sender_Page from "./Sender"
import Driver_Page from "./Driver"

class App extends Component {
  render() {
    return (
      <Router forceRefresh={true}>
        <Switch>
          <Route exact path="/" component={Sender_Page}/>
          <Route path="/sender" component={Sender_Page}/>
          <Route path="/driver" component={Driver_Page}/>
        </Switch>
      </Router>
    );
  }
    
}

export default App;
