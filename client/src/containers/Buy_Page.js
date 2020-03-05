import React, { Component } from 'react'
import Navbar from '../components/navbar.js'
import { Badge, Button, Card, Accordion, InputGroup, FormControl, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'; 
import styles from '../css/Buy_Page.module.css'




export class Buy_Page extends Component {

  state = {
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
    this.updateEther()
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

    let NT = parseInt(e.target.value)
    let ether = (NT / 6792.26)

    console.log(ether)
    this.setState({ether})
  }

  etherFixed = (ether) => {

    if(ether) {
      return ether.toFixed(4)
    } else {
      return 0
    }
    
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
      ether: ether.toFixed(18).toString()
    })

    this.setState({
      loading: true
    })

    setTimeout(() => {
      this.updateEther()
    }, 2000);

  }

  
  render() {
    const { user, history } = this.props
    if(user) {
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
                    <h5 className='mb-3'><Badge variant="warning">{`可以購買到 ${this.etherFixed(this.state.ether)} 以太幣`}</Badge></h5>
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
                <Card.Footer className={'bg-success text-white'} variant="flat">{`目前的以太幣：${this.etherFixed(this.state.balance)} ETH`}</Card.Footer>  
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

export default connect(mapStateToProps)(Buy_Page)

