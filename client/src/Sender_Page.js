import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
import Sender_Request from "./contracts/Sender_Request";
import getWeb3 from "./utils/getWeb3";
import firebase from "firebase/app"
import {
  Link
} from "react-router-dom";
import "firebase/database";
import "./App.css";


class Sender_Page extends Component {
  state = { web3: null, accounts: null, contract: null, order_info: null};
  
  componentDidMount = async () => {
    
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Sender_Request.networks[networkId];
      const instance = new web3.eth.Contract(Sender_Request.abi, deployedNetwork && deployedNetwork.address);

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


    // const newContract = web3.eth.Contract(Sender.abi, address, options)


    const order_info = [delivery_time, delivery_start_location, delivery_end_location, recipient_name, recipient_contact, service, isUrgent, boxSize]
    const contract_options = { data: Sender_Request.bytecode, arguments: order_info }
    const send_options = { from: accounts[0], gas: 4712388, gasPrice: 100000000000 }

    let receipt;
    contract.options.from = accounts[0]
    const newContract = await contract.deploy(contract_options)
      .send(send_options, this.handle_error_and_tx)
      .on('receipt', (rcp) => {
        receipt = rcp
        console.log(receipt)
      })
    
    const data = {};
    data[receipt.transactionHash] = receipt.contractAddress
    await firebase.database().ref("Sender/001/order_addresses").update(data)

    this.setState({ contract_addr: receipt.contractAddress })
    console.log(newContract)

  };

  handle_error_and_tx = async(error, transactionHash) => {
    if(error) {
      console.log(error)
    }
    else if(transactionHash) {
      console.log("tx=" + transactionHash)
    }
  }

  get_order = async () => {

    const { accounts, contract, address } = this.state;

    if(address == null) return;


    let data;
    try {
      contract.options.address = address //設定呼叫合約地址
      data = await contract.methods.get_order_info().call({from: accounts[0]})
    } catch(e) {
      console.log(e)
      alert("查無此合約地址")
      return
    }

    const user = await firebase.database().ref("Sender/001").once('value')
    console.log(user.val())

    const { name, phone_number, sex } = user.val()
    
    console.log(data)

    let dt = new Date(parseInt(data[0]))

    console.log(data[0])
    const order_info = {
      userName: name,
      contract_addr: address,
      userAddr: accounts[0],
      sex: sex == 1 ? "男性" : "女性",
      phone_number: phone_number,
      delivery_time: dt.toLocaleString(),
      delivery_start_location: data[1],
      delivery_end_location: data[2],
      recipient_name: data[3],
      recipient_contact: data[4],
      service: data[5] ? "機車" : "貨車",
      isUrgent: data[6] ? "是" : "否",
      boxSize: data[7],
    }

    this.setState({order_info})
  }


  convert_date = (datetime) => {
    let date = new Date(datetime)

    this.setState({ delivery_time: date.valueOf()})
  }


  test = async () => {
    // await firebase.database().ref('Sender/001/order_addresses').set({4: "4"})
  }


  result_section = () => {
    if(this.state.order_info) {
      const { userName, userAddr, service, isUrgent, boxSize, 
        delivery_time, delivery_start_location, delivery_end_location,
        recipient_name, recipient_contact, contract_addr, phone_number, sex} = this.state.order_info
      return (
        <div className="result_section">
          <div>寄送者名稱：{userName}</div>
          <div>寄送者性別：{sex}</div>
          <div>寄送者帳戶地址：{userAddr}</div>
          <div>寄送者連絡電話：{phone_number}</div>
          <div>客戶合約地址：{contract_addr}</div>
          <div>選擇服務：{service}</div>
          <div>是否為急件：{isUrgent}</div>
          <div>箱子大小：{boxSize}</div>
          <div>運送時間：{delivery_time}</div>
          <div>運送起點：{delivery_start_location}</div>
          <div>運送終點：{delivery_end_location}</div>
          <div>收件者姓名：{recipient_name}</div>
          <div>收件者聯絡方式：{recipient_contact}</div>
        </div>
      )
    } else return null
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="top">
          <Link to="/">
            <Button onClick={this.test}>寄件方</Button>
          </Link>
          <Link to="/driver">
            <Button onClick={this.test}>司機方</Button>
          </Link>
        </div>
        <div>
          <div className="block1">
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
            {
              this.state.contract_addr ? (
                <div className="contract_addr">
                  合約帳戶地址：{this.state.contract_addr}
                </div>
              ) : null
            }
          </div>
          
          <div className="block2">
            <Row>
              <Col md={9}>
                <Form.Control type="search" placeholder="帳戶地址" onChange={(e) => this.setState({ address: e.target.value})}/>
              </Col>
              <Col>
                <Button className="search" onClick={this.get_order}>搜尋</Button>
              </Col>
            </Row>
              
            <this.result_section />
          </div>
        </div>
      </div>
    );
  }
}


export default Sender_Page 