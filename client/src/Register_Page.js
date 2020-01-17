import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
import Sender_Auth from "./contracts/Sender_Auth.json";
import Driver_Auth from "./contracts/Driver_Auth.json";
import getWeb3 from "./utils/getWeb3";
import firebase from "firebase/app"
import {
  Link
} from "react-router-dom";
import "firebase/database";
// import "./App.css";


class Register_Page extends Component {
  state = { 
    web3: null,
    accounts: null,
    contract1: null,
    contract2: null,
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

      const deployedNetwork1 = Sender_Auth.networks[networkId];
      const instance1 = new web3.eth.Contract(Sender_Auth.abi, deployedNetwork1 && deployedNetwork1.address);

      const deployedNetwork2 = Driver_Auth.networks[networkId];
      const instance2 = new web3.eth.Contract(Driver_Auth.abi, deployedNetwork2 && deployedNetwork2.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract1: instance1, contract2: instance2 });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  test = async () => {
    const { accounts, contract1 } = this.state
    const data = [
      "kevin",
      1,
      860417,
      "0979344066",
      "iamhongwei0417@gmail.com",
      "A123456789",
      "1234",
      "1234"
    ]


    await contract1.methods.verify_info(...data).send({from: accounts[0]})

  }

  test2 = async () => {
    const { accounts, contract1 } = this.state

    contract1.events.verification_status().once('data', (event) => {
      console.log(event.returnValues.valid)
    })
  }

  generate_account = async () => {
    const { web3 } = this.state
    const result = await web3.eth.accounts.create();

    const account = await web3.eth.accounts.wallet.add(result.privateKey);

    const is_save = await web3.eth.accounts.wallet.save("");

    if(is_save) {
      const accounts = await web3.eth.getAccounts();

      this.setState({ accounts });

      return account;

    } else {
      alert("Error!")
      return null;
    }
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
            <Button onClick={this.generate_account}>測試3</Button>
        </div>
        <div className="block3">
          <div>寄送者帳號申請</div>
          <Form>
            <Form.Group>
              <Form.Label>選擇服務</Form.Label>
              <Row>
                <Col>
                  <Form.Check type="radio" label="機車" name="radios1" id="rd1" onChange={() => this.setState({ service: 0})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="貨車" name="radios1" id="rd2" onChange={() => this.setState({ service: 1})}/>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>是否為急件</Form.Label>
              <Row>
                <Col>
                  <Form.Check type="radio" label="是" name="radios2" id="rd3" onChange={() => this.setState({ isUrgent: true})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="否" name="radios2" id="rd4" onChange={() => this.setState({ isUrgent: false})}/>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>貨品大小</Form.Label>
              <Row>
                <Col>
                  <Form.Check type="radio" label="小(100)" name="radios3" id="rd5" onChange={() => this.setState({ boxSize: 100})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="中(500)" name="radios3" id="rd6" onChange={() => this.setState({ boxSize: 500})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="大(1000)" name="radios3" id="rd7" onChange={() => this.setState({ boxSize: 1000})}/>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>寄件日期時間</Form.Label>
              <Form.Control type="datetime-local" onChange={(e) => this.convert_date(e.target.value)}/>
            </Form.Group>
            
            <Form.Group>
              <Form.Label>貨物起點</Form.Label>
              <Form.Control type="input" placeholder="起點地址" onChange={(e) => this.setState({ delivery_start_location: e.target.value})}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>貨物終點</Form.Label>
              <Form.Control type="input" placeholder="迄點地址" onChange={(e) => this.setState({ delivery_end_location: e.target.value})}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>收件人</Form.Label>
              <Form.Control type="input" placeholder="收件人姓名" onChange={(e) => this.setState({ recipient_name: e.target.value})}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>收件人聯絡方式</Form.Label>
              <Form.Control type="input" placeholder="手機 or 電話" onChange={(e) => this.setState({ recipient_contact: e.target.value})}/>
            </Form.Group>

            <Button variant="primary" onClick={this.place_order}>
              送出訂單
            </Button>
          </Form>
        </div>
        <div className="block4">
          <div>司機申請</div>
          <Form>
            <Form.Group>
              <Form.Label>選擇服務</Form.Label>
              <Row>
                <Col>
                  <Form.Check type="radio" label="機車" name="radios1" id="rd1" onChange={() => this.setState({ service: 0})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="貨車" name="radios1" id="rd2" onChange={() => this.setState({ service: 1})}/>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>是否為急件</Form.Label>
              <Row>
                <Col>
                  <Form.Check type="radio" label="是" name="radios2" id="rd3" onChange={() => this.setState({ isUrgent: true})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="否" name="radios2" id="rd4" onChange={() => this.setState({ isUrgent: false})}/>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>貨品大小</Form.Label>
              <Row>
                <Col>
                  <Form.Check type="radio" label="小(100)" name="radios3" id="rd5" onChange={() => this.setState({ boxSize: 100})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="中(500)" name="radios3" id="rd6" onChange={() => this.setState({ boxSize: 500})}/>
                </Col>
                <Col>
                  <Form.Check type="radio" label="大(1000)" name="radios3" id="rd7" onChange={() => this.setState({ boxSize: 1000})}/>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>寄件日期時間</Form.Label>
              <Form.Control type="datetime-local" onChange={(e) => this.convert_date(e.target.value)}/>
            </Form.Group>
            
            <Form.Group>
              <Form.Label>貨物起點</Form.Label>
              <Form.Control type="input" placeholder="起點地址" onChange={(e) => this.setState({ delivery_start_location: e.target.value})}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>貨物終點</Form.Label>
              <Form.Control type="input" placeholder="迄點地址" onChange={(e) => this.setState({ delivery_end_location: e.target.value})}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>收件人</Form.Label>
              <Form.Control type="input" placeholder="收件人姓名" onChange={(e) => this.setState({ recipient_name: e.target.value})}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>收件人聯絡方式</Form.Label>
              <Form.Control type="input" placeholder="手機 or 電話" onChange={(e) => this.setState({ recipient_contact: e.target.value})}/>
            </Form.Group>

            <Button variant="primary" onClick={this.place_order}>
              送出訂單
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}


export default Register_Page 