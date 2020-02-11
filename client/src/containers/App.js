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
import Buy_Page from './Buy_Page'
import Delivery_Page from './Delivery_Page'
import io from 'socket.io-client'


class App extends Component {
  componentDidMount = async () => {
    if(this.props.user) {
      var socket = io.connect('http://localhost:5000');
      socket.on('connect', () => {
        socket.emit('load', { user: this.props.user._id });
        console.log(socket.id)
      });
    }
  }
  render() {
    return (
      <Router forceRefresh={true}>
        <Switch>
          <Route exact path="/" component={Login_Page} />
          <Route path="/register" component={Register_Page}/>
          <Route path="/home" component={Home_Page}/>
          <Route path="/buy" component={Buy_Page}/>
          <Route path="/delivery" component={Delivery_Page}/>
        </Switch>
      </Router>
    );
  }
    
}


const mapStateToProps = state => {
  return {
    user: state.userState.user
  }
}

export default connect(mapStateToProps)(App);
