import React, { Component } from 'react'
import Navbar from '../components/navbar.js'
import UserDelivery from '../components/user_delivery'
import DriverDelivery from '../components/driver_delivery'
import { connect } from 'react-redux'
import getWeb3 from '../utils/getWeb3'
import * as Sockets from '../modules/sockets'
import { Button, ToggleButtonGroup, ToggleButton  } from 'react-bootstrap'
import styles from '../css/Delivery_Page.module.css'


export class Delivery_Page extends Component {

  state = {
    web3: null,
    accounts: null,
    select: "Sender",
  }
  
  componentDidMount = async () => {

    if(this.props.user) {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      this.setState({ web3, accounts })
    }
  };


  renderSelect = () => {
    const { web3, accounts, socket, select } = this.state

    switch(select) {
      case "Sender":
        return <UserDelivery web3={web3} accounts={accounts} />
      case "Driver":
        return <DriverDelivery web3={web3} accounts={accounts} />
    }
  }

  setSelect = (e) => {
    this.setState({
      select: e.target.value
    })
  }


  render() {
    const { user, history } = this.props
    if(user) {
      if(this.state.web3) {
        return (
          <div>
            <Navbar />
            <div className="d-flex flex-column">
              <ToggleButtonGroup  size="lg" name="options" type="radio" defaultValue="Sender">
                <ToggleButton value="Sender" className={styles.btn_bd} onChange={this.setSelect}>Sender</ToggleButton>
                <ToggleButton value="Driver" className={styles.btn_bd} onChange={this.setSelect}>Driver</ToggleButton>
              </ToggleButtonGroup>
            </div>
            {
              this.renderSelect()
            }
          </div>
        )
      } else {
        return (
          <div>
            <Navbar/>
            <div>尚未連接區塊鏈</div>
          </div>
        )
      }
    } else { 
      history.replace({pathname: '/'})
      return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
    receipt: state.txnState.receipt
  }
}


export default connect(mapStateToProps)(Delivery_Page)

