/* global google */

import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
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
    sender_info: [[],[],[],[],[],],
    driver_info: [[],[],[],[],[],],
    status: [false,false,false,false,false,false,false,false,false,false,]
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

  place_order = async (n) => {
    const { accounts, contract, sender_info, status } = this.state

    const _sender_info = sender_info
    const _status = status

    await contract.methods.push_sender(accounts[n+1]).send({from: accounts[0]});

    const sender = await contract.methods.get_sender().call();

    console.log(sender)

    _sender_info[n].push("成功送出一筆訂單!")
    _sender_info[n].push("等待中...")
    _status[n] = true

    console.log(_sender_info)

    this.setState({
      sender_info: _sender_info,
      status: _status
    })

  }

  driver_receive = async (n) => {
    const { accounts, contract } = this.state

    await contract.methods.push_driver(accounts[n]).send({from: accounts[0]});

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
    
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="top" style={{marginBottom: '30px'}}>
            <Button onClick={this.test}>測試1</Button>
            <Button onClick={this.test2}>測試2</Button>
            <Button onClick={this.test3}>測試3</Button>
            <Button onClick={this.test4}>測試4</Button>
            <Button onClick={this.test5}>地圖</Button>
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={() => this.place_order(0)} disabled={this.state.status[0]}>寄送訂單</Button>
            {
              this.state.sender_info[0].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
        <div className="block5">
            <span>Sender1</span>
            
            <Form.Group>
              <Row>
                <Col md={7}>
                  <Form.Control type="input" placeholder="寄送者編號" onChange={(e) => this.setState({ delivery_start_location: e.target.value})}/>
                </Col>
                <Col>
                  <Button onClick={this.test}>接訂單</Button>
                </Col>
              </Row>
            </Form.Group>
        
            
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
        <div className="block5">
            <span>Sender1</span>
            <Button onClick={this.test}>寄送訂單</Button>
            <div>
              {this.state.info1}
            </div>
        </div>
      </div>
    );
  }
}


export default Transaction_Page 