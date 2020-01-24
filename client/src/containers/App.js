import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { connect } from 'react-redux'
import Login_Page from './Login_Page'
import Register_Page from './Register_Page'
import Home_Page from './Home_Page'
import { throws } from "assert";


class App extends Component {
  componentDidMount = async () => {
  }
  render() {
    return (
      <Router forceRefresh={true}>
        <Switch>
          <Route exact path="/" component={Login_Page} />
          <Route path="/register" component={Register_Page}/>
          <Route path="/home" component={Home_Page}/>
        </Switch>
      </Router>
    );
  }
    
}


const mapStateToProps = state => {

}

export default connect()(App);
