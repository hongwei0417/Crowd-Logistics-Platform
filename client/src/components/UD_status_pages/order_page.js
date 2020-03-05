import React, { Component } from 'react'
import { Button, Badge, Card, Form, Row, Col, Accordion, ListGroup, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import styles from '../../css/Sender_delivery.module.css'
import SearchModal from '../modal'
import CommitModal from '../modal'
import axios from 'axios'; 
import { updateOrder } from '../../actions/txnAction'
import { get_Status_number } from '../../modules/tools'
import web3 from 'web3'



export class order_page extends Component {

  state = {
    balance: 0,
    open: false,
    loading: false,
    orderInfo: {
      service: 0,
      isUrgent: false,
    },
    showSearchModal: false,
    showCommitModal: false,
    txnData: {
      txnDoc: null,
      receipt: null
    },
    drivers: [],
    second: 10,
    number: 0,
    totalAmount: 0,
    sufficient: false
  }

  constructor(props) {
    super(props)

    this.setOrder = this.setOrder.bind(this)
    this.updateEther = this.updateEther.bind(this)
  }

  async componentDidUpdate() {
    const { showSearchModal, loading } = this.state
    const { currentOrder } = this.props

    if(currentOrder) {
      const number = get_Status_number(currentOrder.status) 

      if(number > 1 && loading && showSearchModal) {
        this.setState({
          showSearchModal: false,
          loading: false,
        })
      }
    }
  }

  async componentDidMount() {

    this.updateEther()
  };

  async componentWillUnmount() {
    clearInterval(this.state.textInterval)
  }

  updateEther = async () => {
    const res = await axios.post('http://localhost:5000/users/getBalance', {
      address: this.props.user.account.address
    })
    this.setState({
      balance: parseFloat(res.data)
    })
  }

  checkOrder = async (e) => {
    e.preventDefault()

    this.setState({loading: true})
    
    const { accounts, contract } = this.props
    const { orderInfo, balance } = this.state
    const { user } = this.props
    const options = { from: accounts[0], gas: 6721975, gasPrice: 20000000000 }

    const gasNeed = await contract.methods.start_transaction(
      user.account.address,
      orderInfo.dTime,
      orderInfo.dlStart,
      orderInfo.dlEnd,
      orderInfo.rName,
      orderInfo.rContact,
      orderInfo.service,
      orderInfo.isUrgent,
      parseInt(orderInfo.boxSize)
    ).estimateGas(options)

    let userHas = web3.utils.toWei(balance.toString(), 'ether')
    let amounut = gasNeed * (10**10)
    let sufficient = false


    //判斷以太幣是否充足
    if(parseFloat(userHas) > amounut) {
      sufficient = true
    }

    this.setState({
      totalAmount: parseFloat(web3.utils.fromWei((amounut).toString(), 'ether')),
      showCommitModal: true,
      sufficient
    })

    console.log("確認訂單...")
  }

  //訂單處理1
  placeOrder = async () => {

    this.setState({showCommitModal: false})
    
    const { accounts, contract } = this.props
    const { orderInfo } = this.state
    const { user } = this.props
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

    this.setState({txnData: {receipt}})

    console.log("程序1完成!")
  }

  //訂單處理2
  handleOrderStart = (event) => {

    const checkState = setInterval(async () => {
      
      const { receipt } = this.state.txnData
      const { user } = this.props

      if(receipt) {
        clearInterval(checkState)

        const res = await axios.post('http://localhost:5000/transactions/add', {
          uid: user._id,
          txnTime: event.returnValues[1],
          receipt: receipt
        })

        if(res.data) {
          this.setState({txnData: {txnDoc: res.data}})
          this.search_driver()
          console.log("程序2完成!")
        } else {
          alert("交易發生問題!")
        }
      }
    }, 500)
    
  }

  //訂單處理3
  search_driver = async () => {

    const { user } = this.props

    //之後透過智能合約這個去篩選司機
    const res = await axios.post('http://localhost:5000/drivers/getDrivers', {uid: user._id})

    if(res.data.length == 0) {
      alert('目前沒有司機!')
      this.setState({
        loading: false,
        showSearchModal: false,
      })
      return
    }
    await this.setState({drivers: res.data, showSearchModal: true})

    this.select_drivers()
    console.log("程序3完成!")
  }

  //訂單處理4
  select_drivers = () => {

    const interval = setInterval(() => {

      const { second, number, drivers } = this.state
      let n;

      if(drivers.length == 0) {
        clearInterval(interval);
        return;
      }

      if(drivers.length == 1) {
        clearInterval(interval);
        this.noticeDriver(drivers[0])
        return;
      }

      //
      while(n == number || n == undefined) {
        n = Math.floor(Math.random()*drivers.length);
      }
 
      if(second > 0) {
        this.setState({number: n})
      } else {
        console.log(number)
        this.noticeDriver(drivers[number])
        clearInterval(interval);

        console.log("程序4完成!")
      }
    }, 400);
  }

  //訂單處理5
  noticeDriver = async (driver) => {

    const { txnDoc } = this.state.txnData
    const { user, socket, updateOrder } = this.props

    const res = await axios.post('http://localhost:5000/orders/add', {
      uuid: user._id,
      duid: driver.uid._id,
      txnTime: txnDoc.txnTime,
      status: "wating",
      txnid: txnDoc._id,
    })

    if(res.data.status) {
      updateOrder(res.data.result, "sender") //更新使用者狀態
      socket.listenOrderUpdate('sender', 'updateOrder') //監聽司機接取訂單狀態
      console.log("程序5完成!")
    } else {
      alert(res.data.msg)
    }
  }

  handleCancle = () => {
    this.setState({
      showCommitModal: false,
      loading: false,
    })
  }

  etherFixed = (ether) => {

    if(ether) {
      return ether.toFixed(4)
    } else {
      return 0
    }
    
  }

  render() {
    return (
      <div>
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
                  <Form onSubmit={(e) => this.checkOrder(e)}>
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
            <Card.Footer className="text-muted">{`目前的以太幣：${this.etherFixed(this.state.balance)} ETH`}</Card.Footer>
          </Card>
        </Accordion>
        <CommitModal
          show={this.state.showCommitModal}
          backdrop={false}
          className={styles.modal}
          title='請確認訂單金額'
          size='sm'
          footer={true}
          handleClose={this.handleCancle.bind(this)}
          handleCommit={this.placeOrder.bind(this)}
          sufficient={this.state.sufficient}
        >
          <h4><Badge variant="warning">{`此筆訂單需要 ${this.etherFixed(this.state.totalAmount)} ETH`}</Badge></h4>
          {
            !this.state.sufficient ? (
              <h4><Badge variant="danger">{`擁有以太幣不足!`}</Badge></h4>
            ) : null
          }
        </CommitModal>
        <SearchModal
          show={this.state.showSearchModal}
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

  convert_date = (datetime) => {
    let date = new Date(datetime)

    this.setOrder('dTime', date.getTime())
  }

  //倒數10s
  reciprocal = () => {
    const interval = setInterval(() => {
      const { second, drivers } = this.state
      if(drivers.length > 1) {
        if(second > 0) {
          this.setState({second: second-1})
        } else {
          this.setState({second: 10})
          clearInterval(interval);
        }
      } else {
        clearInterval(interval)
      }
    }, 1000);
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
}

const mapStateToProps = state => {
  return {
    socket: state.toolState.socket,
    user: state.userState.user,
    currentOrder: state.txnState.sender.currentOrder,
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
    updateOrder: (order, who) => dispatch(updateOrder(order, who))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(order_page)
