import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
import Sender from "./contracts/Sender.json";
import getWeb3 from "./utils/getWeb3";
import firebase from "firebase/app"
import "firebase/database";
import "./App.css";


class App extends Component {
  state = { web3: null, accounts: null, contract: null};

  componentDidMount = async () => {


    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Sender.networks[networkId];
      const instance = new web3.eth.Contract(
        Sender.abi, deployedNetwork && deployedNetwork.address,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      
      var database = firebase.database();

      const name = await database.ref("Sender/001/name").once('value')
      console.log(name.val())

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  place_order = async () => {
    const { accounts, contract, service, isUrgent, boxSize, delivery_time, delivery_start_location, delivery_end_location, recipient_name, recipient_contact } = this.state;

    if (service == null ) { alert("service!"); return}
    if (isUrgent == null ) { alert("isUrgent!"); return}
    if (boxSize == null ) { alert("boxSize!"); return}
    if (delivery_time == null ) { alert("delivery_time!"); return}
    if (delivery_start_location == null ) { alert("delivery_start_location!"); return}
    if (delivery_end_location == null ) { alert("delivery_end_location!"); return}
    if (recipient_name == null ) { alert("recipient_name!"); return}
    if (recipient_contact == null ) { alert("recipient_contact!"); return}

    const order_info = [delivery_time, delivery_start_location, delivery_end_location, recipient_name, recipient_contact, service, isUrgent, boxSize]

    const newContract = await contract.deploy({ data: Sender.bytecode, arguments: order_info })
    .send({ from: accounts[0], gas: 4712388, gasPrice: 100000000000 })


    console.log(newContract)

  };

  get_order = async () => {


    const { accounts, contract } = this.state;

    contract.options.address = "0x3f3E356CF7cAe275ab24c2f60E11eb60B14bC8Cd"

    const response = await contract.methods.get_order_info().call({from: accounts[0]})

    console.log(response)
  }


  convert_date = (datetime) => {
    let date = new Date(datetime)

    this.setState({ delivery_time: date.valueOf()})
  }


  test = async () => {
    console.log(this.state.service)
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="top">
          <Button onClick={this.place_order}>寄件方</Button>
          <Button onClick={this.test}>司機方</Button>
        </div>
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
                <Form.Check type="radio" label="小" name="radios3" id="rd5" onChange={() => this.setState({ boxSize: 100})}/>
              </Col>
              <Col>
                <Form.Check type="radio" label="中" name="radios3" id="rd6" onChange={() => this.setState({ boxSize: 500})}/>
              </Col>
              <Col>
                <Form.Check type="radio" label="大" name="radios3" id="rd7" onChange={() => this.setState({ boxSize: 1000})}/>
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
    );
  }
}

export default App;
