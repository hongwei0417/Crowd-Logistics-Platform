/* global google */

import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
// import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import Transaction from "./contracts/Transaction.json";
import getWeb3 from "./utils/getWeb3";
import firebase from "firebase/app"
import "firebase/database";
// import "./App.css";
import { clearInterval } from "timers";

class Transaction_Page extends Component {
  state = { 
    web3: null,
    accounts: null,
    contract: null,
    sender_info: [[],[],[],[],[],],
    sender_time: [60,60,60,60,60],
    counter_id: ["","","","",""],
    driver_info: [[],[],[],[],[],],
    driver_take_n: [1,1,1,1,1],
    status: [false,false,false,false,false,false,false,false,false,false,],
    query_driver: 0
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

    _sender_info[n].push("成功送出一筆訂單!")
    _sender_info[n].push("等待中...")
    _status[n] = true

    this.setState({
      sender_info: _sender_info,
      status: _status
    })

    this.register_counter(n)

  }

  register_counter = (n) => {
    const counter_id = this.state.counter_id

    counter_id[n] = window.setInterval(() => {
      const sender_time = this.state.sender_time
      sender_time[n]--

      if(sender_time[n] < 1) {
        window.clearInterval(this.state.counter_id[n])
        sender_time[n] = 60

        this.matching(n)
      }
      this.setState({ sender_time })
    }, 1000)

    this.setState({ counter_id })
  }


  driver_receive = async (n, sid) => {
    const { accounts, contract, sender_info, driver_info, status } = this.state

    const _sender_info = sender_info
    const _driver_info = driver_info
    const _status = status 

    const sender = await contract.methods.get_sender().call();
    let has_order = false

    //檢查是否有這個訂單
    for(let i = 0; i < sender.length; i++) {
      if(accounts[sid] == sender[i]) {
        has_order = true
      }
    }
    if(!has_order) {
      alert(`Sender-${sid}目前沒有訂單!`)
      return;
    }; 


    await contract.methods.push_driver(accounts[sid], accounts[n+6]).send({from: accounts[0]});

    const driver = await contract.methods.get_driver(accounts[sid]).call();

    _driver_info[n].push("接取要求成功")
    _driver_info[n].push("等待司機比較中...")
    _status[n+5] = true

    _sender_info[sid-1].push(`目前${driver.length}位司機接取...`)

    this.setState({
      driver_info: _driver_info,
      sender_info: _sender_info,
      status: _status,
    })
  }


  matching = async (n) => {
    const { accounts, contract } = this.state

    const can_match = await contract.methods.check_matching().call();

    if(!can_match) {
      const sender_info = this.state.sender_info
      const status = this.state.status
      await contract.methods.pop_sender(0).send({from: accounts[0]});
      sender_info[n].push("目前沒有可用的司機!")
      status[n] = false
      this.setState({sender_info, status})
      return;
    }

    const driver = await contract.methods.get_driver(accounts[n+1]).call();


    contract.events.get_match().once('data', (event) => {
      this.update_mathcing_result(event.returnValues, n, driver)
    })

    await contract.methods.matching().send({from: accounts[0], gas:6000000}) //觸發事件回傳配對結果

  }

  update_mathcing_result = (result, n, driver) => {
    const { sender_info, driver_info, status, accounts } = this.state
    const _sender_info = sender_info
    const _driver_info = driver_info
    const _status = status

    let driver_index; //獲得訂單司機位置
    let driver_index_list = [5]; //儲存有接單司機的位置

    for(let i = 0; i < accounts.length; i++) {
      if(accounts[i] == result[1]) { //與driver地址配對
        driver_index = i
      }
      for(let j = 0; j < driver.length; j++) {
        if(accounts[i] == driver[j]) {
          driver_index_list[j] = i
        }
      }
    }

    _sender_info[n].push(`配對成功!`)
    _sender_info[n].push(`您的司機為: Driver-${driver_index-5}`)

    _status[n] = false

    driver_index_list.map((i) => {
      _status[i-1] = false
      if(i == driver_index) {
        _driver_info[i-6].push(`配對成功!`)
        _driver_info[i-6].push(`您的訂單為: Sender-${n+1}`)
      } else {
        _driver_info[i-6].push("未成功分配到訂單!")
      }
    })

    this.setState({
      sender_info: _sender_info,
      driver_info: _driver_info,
      status: _status
    })
  }


  set_driver_take_n = async(i, n) => {
    const driver_take_n = this.state.driver_take_n
    driver_take_n[i] = n

    this.setState({driver_take_n})
  }

  get_sender = async() => {
    const { contract } = this.state
    const sender = await contract.methods.get_sender().call();

    console.log(sender)
  }

  get_driver = async(n) => {
    const { contract, accounts } = this.state
    const driver = await contract.methods.get_driver(accounts[n]).call();

    console.log(driver)
  }

  clear_sender = async() => {
    const { contract, accounts } = this.state

    await contract.methods.clear().send({from: accounts[0]});

  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="top" style={{}}>
            <Button onClick={this.get_sender}>取得目前鏈上寄送者</Button>
            <Button onClick={this.clear_sender}>清除鏈上寄送者</Button>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Control type="input" placeholder="接單編號" onChange={(e) => this.setState({query_driver: parseInt(e.target.value)})}/>
                </Col>
                <Col>
                  <Button onClick={() => this.get_driver(this.state.query_driver)}>取得目前鏈上司機</Button>
                </Col>
              </Row>
            </Form.Group>
        </div>
        <div className="block5">
            <span>Sender-1</span>
            <Button onClick={() => this.place_order(0)} disabled={this.state.status[0]}>
            {`寄送訂單 ${this.state.sender_time[0] == 60 ? "" : this.state.sender_time[0]}`}
            </Button>
            {
              this.state.sender_info[0].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
        </div>
        <div className="block5">
            <span>Sender-2</span>
            <Button onClick={() => this.place_order(1)} disabled={this.state.status[1]}>
            {`寄送訂單 ${this.state.sender_time[1] == 60 ? "" : this.state.sender_time[1]}`}
            </Button>
            {
              this.state.sender_info[1].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
        </div>
        <div className="block5">
            <span>Sender-3</span>
            <Button onClick={() => this.place_order(2)} disabled={this.state.status[2]}>
            {`寄送訂單 ${this.state.sender_time[2] == 60 ? "" : this.state.sender_time[2]}`}
            </Button>
            {
              this.state.sender_info[2].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
        </div>
        <div className="block5">
            <span>Sender-4</span>
            <Button onClick={() => this.place_order(3)} disabled={this.state.status[3]}>
            {`寄送訂單 ${this.state.sender_time[3] == 60 ? "" : this.state.sender_time[3]}`}
            </Button>
            {
              this.state.sender_info[3].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
        </div>
        <div className="block5">
            <span>Sender-5</span>
            <Button onClick={() => this.place_order(4)} disabled={this.state.status[4]}>
            {`寄送訂單 ${this.state.sender_time[4] == 60 ? "" : this.state.sender_time[4]}`}
            </Button>
            {
              this.state.sender_info[4].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
        </div>
        
        <div className="block5">
            <span>Driver-1</span>
            
            <Form.Group>
              <Row>
                <Col md={7}>
                  <Form.Control type="input" placeholder="寄送者編號" onChange={(e) => this.set_driver_take_n(0, parseInt(e.target.value))}/>
                </Col>
                <Col>
                  <Button onClick={() => this.driver_receive(0, this.state.driver_take_n[0])} disabled={this.state.status[5]}>接訂單</Button>
                </Col>
              </Row>
            </Form.Group>
            {
              this.state.driver_info[0].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
            
        </div>
        <div className="block5">
            <span>Driver-2</span>
            
            <Form.Group>
              <Row>
                <Col md={7}>
                  <Form.Control type="input" placeholder="寄送者編號" onChange={(e) => this.set_driver_take_n(1, parseInt(e.target.value))}/>
                </Col>
                <Col>
                  <Button onClick={() => this.driver_receive(1, this.state.driver_take_n[1])} disabled={this.state.status[6]}>接訂單</Button>
                </Col>
              </Row>
            </Form.Group>
            {
              this.state.driver_info[1].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
            
        </div><div className="block5">
            <span>Driver-3</span>
            
            <Form.Group>
              <Row>
                <Col md={7}>
                  <Form.Control type="input" placeholder="寄送者編號" onChange={(e) => this.set_driver_take_n(2, parseInt(e.target.value))}/>
                </Col>
                <Col>
                  <Button onClick={() => this.driver_receive(2, this.state.driver_take_n[2])} disabled={this.state.status[7]}>接訂單</Button>
                </Col>
              </Row>
            </Form.Group>
            {
              this.state.driver_info[2].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
            
        </div><div className="block5">
            <span>Driver-4</span>
            
            <Form.Group>
              <Row>
                <Col md={7}>
                  <Form.Control type="input" placeholder="寄送者編號" onChange={(e) => this.set_driver_take_n(3, parseInt(e.target.value))}/>
                </Col>
                <Col>
                  <Button onClick={() => this.driver_receive(3, this.state.driver_take_n[3])} disabled={this.state.status[8]}>接訂單</Button>
                </Col>
              </Row>
            </Form.Group>
            {
              this.state.driver_info[3].map((item, index) => (
                <div key={index}>{item}</div>
              ))
            }
            
        </div>
      </div>
    );
  }
}


export default Transaction_Page 