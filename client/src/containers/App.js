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
import Socket from '../modules/sockets'



class App extends Component {
  componentDidMount = async () => {
    const { user } = this.props
    if(user) {
      const socket = new Socket(user);
      socket.listenOrder();
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
