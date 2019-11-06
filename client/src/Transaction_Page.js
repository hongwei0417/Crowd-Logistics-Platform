/* global google */

import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
import direction from 'google-maps-direction'
// import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import Transaction from "./contracts/Transaction.json";
import getWeb3 from "./utils/getWeb3";
import firebase from "firebase/app"
import "firebase/database";
import "./App.css";

class Transaction_Page extends Component {
  state = { 
    web3: null,
    accounts: null,
    contract: null,
    order_info: null
  };


  componentDidMount = async () => {
    
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = Transaction.networks[networkId];
      const instance = new web3.eth.Contract(Transaction.abi, deployedNetwork && deployedNetwork.address);


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  test = async () => {
    const { accounts, contract } = this.state

    await contract.methods.push_sender(accounts[1]).send({from: accounts[0]});

    const sender = await contract.methods.get_sender().call();

    console.log(sender)

  }

  test2 = async () => {
    const { accounts, contract } = this.state

    await contract.methods.push_driver(accounts[2]).send({from: accounts[0]});

    const driver = await contract.methods.get_driver().call();

    console.log(driver)

  }


  test3 = async () => {
    const { accounts, contract } = this.state

    // const s = await contract.methods.pop_sender(0).send({from: accounts[0]});


    await contract.methods.matching().send({from: accounts[0], gas:6000000})



  }

  test4 = async () => {
    const { contract } = this.state
    contract.events.get_match().once('data', (event) => {
      console.log(event.returnValues)
    })

  }

  test5 = async() => {
    direction({
      origin: 'bukit damansara',
      destination: 'klcc'
    })
    .then(function(result){
      // return result
      //   routes: [...],
      //   geocoded_waypoints: [...],
      //   status: "OK"
      console.log(result)
    });
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="top">
            <Button onClick={this.test}>測試1</Button>
            <Button onClick={this.test2}>測試2</Button>
            <Button onClick={this.test3}>測試3</Button>
            <Button onClick={this.test4}>測試4</Button>
            <Button onClick={this.test5}>地圖</Button>
        </div>
      </div>
    );
  }
}


export default Transaction_Page 