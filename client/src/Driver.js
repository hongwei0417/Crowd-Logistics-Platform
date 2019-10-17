import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
import Driver from "./contracts/Driver.json";
import getWeb3 from "./utils/getWeb3";
import firebase from "firebase/app"
import {
  Link
} from "react-router-dom";
import "firebase/database";
import "./App.css";


class Driver_Page extends Component {
  state = { web3: null, accounts: null, contract: null, driver_info: null};

  
  componentDidMount = async () => {
    
    try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Driver.networks[networkId];
      const instance = new web3.eth.Contract(Driver.abi, deployedNetwork && deployedNetwork.address);

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
    const { accounts, contract, service, delivery_start_time, delivery_end_time, regular_place } = this.state;

    if (service == null ) { alert("service!"); return}
    if (delivery_start_time == null ) { alert("delivery_start_time!"); return}
    if (delivery_end_time == null ) { alert("delivery_end_time!"); return}
    if (regular_place == null ) { alert("regular_place!"); return}


    // const newContract = web3.eth.Contract(Sender.abi, address, options)


    const driver_info = [service, delivery_start_time, delivery_end_time, regular_place]
    const contract_options = { data: Driver.bytecode, arguments: driver_info }
    const send_options = { from: accounts[1], gas: 4712388, gasPrice: 100000000000 }

    let receipt;
    contract.options.from = await accounts[1]
    const newContract = await contract.deploy(contract_options)
      .send(send_options, this.handle_error_and_tx)
      .on('receipt', (rcp) => {
        receipt = rcp
        console.log(receipt)
      })
    
    await firebase.database().ref("Driver/001/eth_address").set(receipt.contractAddress)

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
      data = await contract.methods.get_driver_info().call({from: accounts[1]})
    } catch(e) {
      console.log(e)
      alert("查無此合約地址")
      return
    }

    const user = await firebase.database().ref("Driver/001").once('value')
    const { eth_address, license_plate, name, sex, phone_number } = user.val()
    console.log(user.val())
    
    console.log(data)

    // let dst = new Date(parseInt(data[1]))
    // let det = new Date(parseInt(data[2]))

    console.log(data[0])
    const driver_info = {
      userName: name,
      userAddr: accounts[1],
      contract_addr: eth_address,
      license_plate: license_plate,
      sex: sex == 1 ? "男性" : "女性",
      phone_number: phone_number,
      service: data[0] ? "機車" : "貨車",
      delivery_start_time: data[1],
      delivery_end_time: data[2],
      regular_place: data[3]
    }

    this.setState({driver_info})
  }


  convert_start_time = (t) => {
    let time = new Date(t)
    console.log(t)

    this.setState({ delivery_start_time: t})
  }

  convert_end_time = (t) => {
    let time = new Date(t)

    this.setState({ delivery_end_time: t})
  }


  test = async () => {
    // await firebase.database().ref('Sender/001/order_addresses').set({4: "4"})
  }


  result_section = () => {
    if(this.state.driver_info) {
      const { userName, userAddr, service, contract_addr, delivery_start_time, delivery_end_time, regular_place,
        license_plate, sex, phone_number} = this.state.driver_info
      return (
        <div className="result_section">
          <div>司機名稱：{userName}</div>
          <div>司機性別：{sex}</div>
          <div>司機帳戶地址：{userAddr}</div>
          <div>司機合約地址：{contract_addr}</div>
          <div>司機車牌號碼：{license_plate}</div>
          <div>司機連絡電話：{phone_number}</div>
          <div>選擇服務：{service}</div>
          <div>服務時間：{delivery_start_time} ~ {delivery_end_time}</div>
          <div>常去地點：{regular_place}</div>
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
                <Form.Label>所提供服務</Form.Label>
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
                <Form.Label>提供服務之時間</Form.Label>
                <Row>
                  <Col>
                    <Form.Control type="time" onChange={(e) => this.convert_start_time(e.target.value)}/>
                  </Col>
                  {"到"}
                  <Col>
                    <Form.Control type="time" onChange={(e) => this.convert_end_time(e.target.value)}/>
                  </Col>
                </Row>
              </Form.Group>
              
              <Form.Group>
                <Form.Label>常去地點</Form.Label>
                <Form.Control type="input" placeholder="輸入活動區域" onChange={(e) => this.setState({ regular_place: e.target.value})}/>
              </Form.Group>


              <Button variant="primary" onClick={this.place_order}>
                送出司機資料
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


export default Driver_Page;
