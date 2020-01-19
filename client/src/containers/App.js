import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "firebase/database";
import Login_Page from './Login_Page'
import Register_Page from './Register_Page'


class App extends Component {
  render() {
    return (
      <Router forceRefresh={true}>
        <Switch>
          <Route exact path="/" component={Login_Page} />
          <Route path="/register" component={Register_Page}/>
        </Switch>
        {/* <Switch>
          <Route exact path="/" component={Sender_Page}/>
          <Route path="/sender" component={Sender_Page}/>
          <Route path="/driver" component={Driver_Page}/>
          <Route path="/transaction" component={Transaction_Page}/>
        </Switch> */}
      </Router>
    );
  }
    
}

export default App;