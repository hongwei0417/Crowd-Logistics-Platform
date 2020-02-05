import React, { Component } from 'react'
import Navbar from '../components/navbar.js'
import { Button, Card, Form, Row, Col, Accordion, ListGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'; 
import styles from '../css/Delivery_Page.module.css'
import getWeb3 from '../utils/getWeb3'
import Transaction from '../contracts/Transaction.json'
import { newTXN, clearTXN } from '../actions/txnAction'
import SearchModal from '../components/modal'

const transaction_addr = '0xae06db5a2ddB8d2741243362aDdD708F30D55a00';

export class Delivery_Page extends Component {

  state = {
    web3: null,
    contract: null,
    accounts: null,
    balance: "",
    open: false,
    loading: false,
    orderInfo: {
      service: 0,
      isUrgent: false,
    },
    showModal: false,
    drivers: [],
    second: 10,
    number: 0,
  }

  constructor(props) {
    super(props)

    this.setOrder = this.setOrder.bind(this)
    this.updateEther = this.updateEther.bind(this)
  }

  componentDidMount = async () => {

    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(Transaction.abi, transaction_addr);

    // this.search_driver()

    this.setState({ web3, contract, accounts })
    this.updateEther()
    contract.once('order_time', (error, event) => this.handleOrderStart(event))

  };

  updateEther = async () => {
    const res = await axios.post('http://localhost:5000/users/getBalance', {
      address: this.props.user.account.address
    })
    this.setState({
      balance: parseInt(res.data)
    })
  }
  
  placeOrder = async (e) => {
    e.preventDefault()
    
    const { orderInfo, web3, contract, accounts } = this.state
    const { user, newTXN } = this.props
    const options = { from: accounts[0], gas: 6721975, gasPrice: 20000000000 }

     //監聽訂單進入區塊鏈
    // contract.once('order_time', (error, event) => this.handleOrderStart(event))

    //寫入訂單到鏈上
    const receipt = await contract.methods.start_transaction(
      user.account.address,
      orderInfo.dTime,
      orderInfo.dlStart,
      orderInfo.dlEnd,
      orderInfo.rName,
      orderInfo.rContact,
      orderInfo.service,
      orderInfo.isUrgent,
      parseInt(orderInfo.boxSize)
    ).send(options)

    //紀錄到redux
    await newTXN(receipt);

    this.setState({loading: true})
  }

  handleOrderStart = (event) => {

    const checkState = setInterval(async () => {
      console.log(this.state.loading)
      if(this.state.loading) {
        clearInterval(checkState)
        const { user, receipt } = this.props

        console.log(receipt)

        const res = await axios.post('http://localhost:5000/transactions/add', {
          uid: user._id,
          txnTime: event.returnValues[1],
          receipt: receipt
        })
        this.search_driver(event.returnValues)
        console.log(event.returnValues)
      }
    }, 500)
    
  }

  search_driver = async () => {

    //搜尋司機
    const res = await axios.post('http://localhost:5000/drivers/getDrivers')

    await this.setState({drivers: res.data, showModal: true})

    this.select_drivers_animation()
  }

  select_drivers_animation = () => {
    //動畫
    const interval = setInterval(() => {
      const { second, number, drivers } = this.state
      let n;
      if(drivers.length > 1) {
        while(n == number || n == undefined) {
          n = Math.floor(Math.random()*drivers.length);
        }
      } else {
        n = 1;
      }

      if(second > 0 || drivers.length == 0) {
        this.setState({number: n})
      } else {
        console.log(number)
        clearInterval(interval);
      }
    }, 400);
  }

  reciprocal = () => {
    const interval = setInterval(() => {
      const { second } = this.state
      if(second > 0) {
        this.setState({second: second-1})
      } else {
        this.setState({second: 10})
        clearInterval(interval);
      }
    }, 1000);
  }


  convert_date = (datetime) => {
    let date = new Date(datetime)

    this.setOrder('dTime', date.getTime())
  }

  setOrder = async (key, value) => {
    await this.setState({
      orderInfo: {
        ...this.state.orderInfo,
        [key]: value
      }
    })

    console.log(this.state.orderInfo)
  }
  
  render() {
    const { user, history } = this.props
    if(this.state.web3) {
      if(user) {
        return (
          <div>
            <Navbar />
            <div>
              <Accordion>
                <Card className="text-center">
                  <Accordion.Toggle
                    className='bg-warning' 
                    ref={b => this.acc = b}
                    as={Card.Header}
                    eventKey="0"
                    onClick={() => this.setState({open: !this.state.open})}
                  >
                    {this.state.open ? '輸入您的訂單資訊' : '我有貨物要送'}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0" className={styles.flexbox}>
                    <div className={styles._flexbox}>
                      <Card.Body className={styles.fb}>
                        <Form onSubmit={(e) => this.placeOrder(e)}>
                          <Form.Row>
                            <Form.Group as={Col}>
                              <Form.Label>選擇服務</Form.Label>
                              <Row>
                                <Col>
                                  <Form.Check
                                    checked={this.state.orderInfo.service==0}
                                    type="radio"
                                    label="機車(20kg)"
                                    name="radios1"
                                    id="rd1"
                                    onChange={() => this.setOrder('service', 0)}
                                  />
                                </Col>
                                <Col>
                                  <Form.Check
                                    checked={this.state.orderInfo.service==1}
                                    type="radio"
                                    label="貨車(500kg)"
                                    name="radios1"
                                    id="rd2"
                                    onChange={() => this.setOrder('service', 1)}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>是否為急件</Form.Label>
                              <Row>
                                <Col>
                                  <Form.Check
                                    checked={this.state.orderInfo.isUrgent==true}
                                    type="radio"
                                    label="是"
                                    name="radios2"
                                    id="rd3"
                                    onChange={() => this.setOrder('isUrgent', true)}
                                  />
                                </Col>
                                <Col>
                                  <Form.Check
                                    checked={this.state.orderInfo.isUrgent==false}
                                    type="radio"
                                    label="否"
                                    name="radios2"
                                    id="rd4"
                                    onChange={() => this.setOrder('isUrgent', false)}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </Form.Row>
  
                          <Form.Group>
                            <Form.Label>貨品大小</Form.Label>
                            <Form.Control
                              required
                              type="input"
                              placeholder={`貨物重量(最多${this.state.orderInfo.service==0?'20kg':'500kg'})`}
                              onChange={(e) => this.setOrder('boxSize', e.target.value)}
                            />
                          </Form.Group>
  
                          <Form.Group>
                            <Form.Label>寄件日期時間</Form.Label>
                            <Form.Control
                              required
                              type="datetime-local"
                              onChange={(e) => this.convert_date(e.target.value)}
                            />
                          </Form.Group>
                          
                          <Form.Group>
                            <Form.Label>貨物起點</Form.Label>
                            <Form.Control
                              required
                              type="input"
                              placeholder="起點地址"
                              onChange={(e) => this.setOrder('dlStart', e.target.value)}
                            />
                          </Form.Group>
  
                          <Form.Group>
                            <Form.Label>貨物終點</Form.Label>
                            <Form.Control
                              required
                              type="input"
                              placeholder="迄點地址"
                              onChange={(e) => this.setOrder('dlEnd', e.target.value)}
                            />
                          </Form.Group>
  
                          <Form.Row>
                            <Col>
                              <Form.Group>
                                <Form.Label>收件人</Form.Label>
                                <Form.Control
                                  required
                                  type="input"
                                  placeholder="收件人姓名"
                                  onChange={(e) => this.setOrder('rName', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group>
                                <Form.Label>收件人聯絡方式</Form.Label>
                                <Form.Control
                                  required
                                  type="input"
                                  placeholder="手機 or 電話"
                                  onChange={(e) => this.setOrder('rContact', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                          </Form.Row>
                          <Button
                            type="submit"
                            variant="primary"
                          >
                            送出訂單
                          </Button>
                        </Form>
                      </Card.Body>
                    </div>
                  </Accordion.Collapse>
                  <Card.Footer className="text-muted">{`目前的以太幣：${this.state.balance} (wei)`}</Card.Footer>
                </Card>
              </Accordion>
            </div>
            <SearchModal
              show={this.state.showModal}
              backdrop={false}
              className={styles.modal}
              title='搜尋司機請等候...'
              onShow={this.reciprocal}
            >
              <div>
                <ListGroup>
                  <ListGroup.Item variant="warning" className="text-center">等候 {this.state.second} 秒</ListGroup.Item>
                  {
                    this.state.drivers.map((driver, i) => {
                      return (
                        <ListGroup.Item action key={i} variant={this.state.number == i ? "success" : ""}>{driver.uid.username}</ListGroup.Item>
                      )
                    })
                  }
                </ListGroup>
              </div>
            </SearchModal>
          </div>
        )
      } else { history.replace({pathname: '/'}) }
    } else {
      return (
        <div>
          <Navbar/>
          <div>尚未連接區塊鏈</div>
        </div>
      )
    }
   
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
    receipt: state.txnState.receipt
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    newTXN: (receipt) => dispatch(newTXN(receipt)),
    clearTXN: () => dispatch(clearTXN()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Delivery_Page)

