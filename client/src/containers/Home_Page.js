import React, { Component } from 'react';
import { Carousel, ListGroup, Jumbotron, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar.js'
import { connect } from 'react-redux'
import axios from 'axios'; 




class Home_Page extends Component {
  state = {
    transactions: []
  }

  componentDidMount = async () => {

    const { user } = this.props
    
    if(user) {
      const res = await axios.post(`http://localhost:5000/transactions/get/${user._id}`)

      console.log(res.data)
    
      this.setState({
        transactions: Object.values(res.data)
      })
    }
  };
  
  
  render() {
    const { user, history } = this.props
    if(user) {
      return (
        <div>
          <Navbar />
          {
            <Jumbotron>
            <h1>Hello, {user.username} !</h1>
            <p>
              Your transactions records：
            </p>
            <ListGroup>
              <ListGroup.Item action variant="success">Blockchain address： {user.account.address}</ListGroup.Item>
              <ListGroup.Item action variant="info">Private key： {user.account.privateKey}</ListGroup.Item>
              {
                this.state.transactions.map((receipt, i) => {
                  return (
                    <ListGroup.Item action key={i} >{receipt.transactionHash}</ListGroup.Item>
                  )
                })
              }
            </ListGroup>
          </Jumbotron>
          }
        </div>
      );
    } else {
      history.replace({pathname: '/'})
      return null;
    }
  }
}
const mapStateToProps = state => {
  return {
    user: state.userState.user
  }
}


export default connect(mapStateToProps)(Home_Page);