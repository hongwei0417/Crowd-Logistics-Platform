import React, { Component } from 'react'
import Navbar from '../components/navbar.js'
import { Button, Card, Form, Row, Col, Accordion } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'; 
import styles from '../css/Delivery_Page.module.css'




export class Delivery_Page extends Component {

  state = {
    balance: "",
    open: false,
    loading: false,
    orderInfo: {
      service: 0,
      isUrgent: false,
      // boxSize: 
    }
  }

  constructor(props) {
    super(props)

    this.setOrder = this.setOrder.bind(this)
    this.updateEther = this.updateEther.bind(this)
  }

  componentDidMount = async () => {
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

  setEther = (e) => {
    this.setState({
      ether: e.target.value
    })
  }
  
  
  placeOrder = async () => {
    const { orderInfo } = this.state
    const { user } = this.props

    const receipt = await axios.post("http://localhost:5000/transactions/sendEther", {
      address: user.account.address,
      ether: parseInt(ether)
    })

    this.setState({
      loading: true
    })

    setTimeout(() => {
      this.updateEther()
      this.setState({
        loading: false
      })
      // this.acc.click()
      console.log(receipt)
    }, 2000);

  }

  convert_date = (datetime) => {
    let date = new Date(datetime)

    this.setOrder('deliveryTime', date)
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
                      <Form>
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
                            onChange={(e) => this.setOrder('dsl', e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>貨物終點</Form.Label>
                          <Form.Control
                            required
                            type="input"
                            placeholder="迄點地址"
                            onChange={(e) => this.setOrder('del', e.target.value)}
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
                                onChange={(e) => this.setOrder('recipientName', e.target.value)}
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
                                onChange={(e) => this.setOrder('phoneNumber', e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Form.Row>
                        <Button
                          type="submit"
                          variant="primary"
                          onClick={this.placeOrder}>
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
        </div>
      )
    } else { history.replace({pathname: '/'}) }
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user
  }
} 

export default connect(mapStateToProps)(Delivery_Page)

