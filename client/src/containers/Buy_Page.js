import React, { Component } from 'react'
import Navbar from '../components/navbar.js'
import { Badge, Button, Card, Accordion, InputGroup, FormControl, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import Modal from '../components/modal'
import axios from 'axios'; 
import styles from '../css/Buy_Page.module.css'
import { wei_to_ether, ether_to_wei } from '../modules/tools'
import getWeb3 from '../utils/getWeb3'

export class Buy_Page extends Component {

  state = {
    web3: null,
    balance: 0,
    ether: 0,
    loading: false
  }

  constructor(props) {
    super(props)

    this.buy = this.buy.bind(this)
    this.updateEther = this.updateEther.bind(this)
  }

  componentDidMount = async () => {
    const web3 = await getWeb3();
    if(web3) {
      this.updateEther()
      this.setState({web3})
    }
  };

  updateEther = async () => {
    const res = await axios.post('http://localhost:5000/users/getBalance', {
      address: this.props.user.account.address
    })

    this.setState({
      balance: parseFloat(res.data),
      loading: false,
    })
  }

  setEther = (e) => {

    let NT = parseInt(e.target.value) || 0
    let wei = ether_to_wei((NT / 6792.26).toFixed(18))
    let ether = wei_to_ether(wei, false)

    this.setState({ether})
  }
  
  buy = async () => {
    const { ether } = this.state
    const { user } = this.props
    if(ether == "") {
      alert("請勿空白！")
      return
    }

    const receipt = await axios.post("http://localhost:5000/transactions/sendEther", {
      address: user.account.address,
      ether: ether.toString()
    })

    this.setState({
      loading: true
    })

    setTimeout(() => {
      this.updateEther()
    }, 2000);

  }

  test = () => {
    return (
      <div></div>
    )
  }
  
  render() {
    const { web3 } = this.state
    const { user, history } = this.props
    if(user) {
      if(web3) {
        return (
          <div>
            <Navbar />
            <div className={styles.flexbox}>
              <Accordion>
                <Card className={`text-center ${styles.card}`}>
                  <Card.Img variant="top" className={styles.cardImg} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoWc1JMZ4Q7QJEo6gUyiNbY-P69KgPkLQ9U2rlt9_ipnuvSqHk&s" />
                  <Accordion.Toggle  className='bg-warning' ref={b => this.acc = b} as={Card.Header} eventKey="0">
                    購買以太幣
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Card.Title>請輸入要付款的台幣</Card.Title>         
                      <InputGroup className="mb-3">
                        <FormControl
                          placeholder="Enter how much NT dollars you want to pay..."
                          style={{textAlign: 'center'}}
                          onChange={this.setEther}
                        />
                      </InputGroup>
                      <h5 className='mb-3'><Badge variant="warning">{`可以購買到 ${(this.state.ether).toFixed(4)} 以太幣`}</Badge></h5>
                      <Button variant="primary" disabled={this.state.loading} onClick={this.buy}>
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
                          this.state.loading ? 'Loading' : '確定購買'
                        }
                      </Button>
                    </Card.Body>
                  </Accordion.Collapse>
                  <Card.Footer className={'bg-success text-white'} variant="flat">{`目前的以太幣：${wei_to_ether(this.state.balance, true)} ETH`}</Card.Footer>  
                </Card>
              </Accordion>
            </div>
          </div>
        )
      } else {
        return (
          <div>
            <Modal
              show={true}
              backdrop={false}
            >
              <h1 className='text-center'>連接區塊鏈中...</h1>
            </Modal>
          </div>
        )
      }
      
    } else { history.replace({pathname: '/'}) }
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user
  }
} 

export default connect(mapStateToProps)(Buy_Page)

