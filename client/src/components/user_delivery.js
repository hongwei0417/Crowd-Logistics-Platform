import React, { Component } from 'react'
import { Button, Card, Form, Row, Col, Accordion, ListGroup, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import styles from '../css/Sender_delivery.module.css'
import SearchModal from './modal'
import axios from 'axios'; 
import ethFile from '../eth.json';
import Transaction from '../contracts/Transaction.json'
import { newTXN, newBcValue, clearTXN } from '../actions/txnAction'


export class user_delivery extends Component {

  state = {
    contract: null,
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

    const { web3 } = this.props

    const contract = new web3.eth.Contract(Transaction.abi, ethFile.transaction_addr);

    this.setState({ contract })
    this.updateEther()
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
    
    const { accounts } = this.props
    const { orderInfo, contract } = this.state
    const { user, newTXN } = this.props
    const options = { from: accounts[0], gas: 6721975, gasPrice: 20000000000 }

    //監聽訂單進入區塊鏈
    contract.once('order_time', (error, event) => this.handleOrderStart(event))

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

  //訂單開始處理
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

        await this.props.newBcValue(event.returnValues)

        this.search_driver()
        console.log(event.returnValues)
      }
    }, 500)
    
  }

  //搜尋司機
  search_driver = async () => {

    const res = await axios.post('http://localhost:5000/drivers/getDrivers')

    await this.setState({drivers: res.data, showModal: true})

    this.select_drivers_animation()
  }

  //每隔400ms切換選擇司機
  select_drivers_animation = () => {

    console.log(this.props.bcValue)
    const interval = setInterval(() => {

      const { second, number, drivers } = this.state
      let n;

      if(drivers.length == 0) {
        clearInterval(interval);
        return;
      }

      while(n == number || n == undefined) {
        n = Math.floor(Math.random()*drivers.length);
      }
 
      if(second > 0) {
        this.setState({number: n})
      } else {
        console.log(number)
        this.noticeDriver(drivers[6])
        clearInterval(interval);
      }
    }, 400);
  }

  //倒數10s
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

  //通知司機
  noticeDriver = async (driver) => {

    const { user, bcValue } = this.props

    axios.post('http://localhost:5000/orders/add', {
      uuid: user._id,
      duid: driver.uid._id,
      txnTime: bcValue[1],
      status: "wating"
    })

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
    return (
      <div>
        <button onClick={this.noticeDriver}>123</button>
        <Accordion>
          <Card className="text-center">
            <Accordion.Toggle
              className='bg-warning' 
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
                      {
                        this.state.loading ? (
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : null
                      }
                      {
                        this.state.loading ? 'Loading' : '送出訂單'
                      }
                    </Button>
                  </Form>
                </Card.Body>
              </div>
            </Accordion.Collapse>
            <Card.Footer className="text-muted">{`目前的以太幣：${this.state.balance} (wei)`}</Card.Footer>
          </Card>
        </Accordion>
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
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
    receipt: state.txnState.receipt,
    bcValue: state.txnState.bcValue,
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
    newTXN: (payload) => dispatch(newTXN(payload)),
    newBcValue: (payload) => dispatch(newBcValue(payload)),
    clearTXN: () => dispatch(clearTXN()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(user_delivery)
