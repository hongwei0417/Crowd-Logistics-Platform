import React, { Component } from 'react'
import Navbar from '../components/navbar.js'
import { Button, Card, Accordion, InputGroup, FormControl, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'; 
import styles from '../css/Buy_Page.module.css'




export class Buy_Page extends Component {

  state = {
    balance: "",
    ether: "",
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
      balance: parseInt(res.data)
    })
  }

  setEther = (e) => {
    this.setState({
      ether: e.target.value
    })
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
                    <Card.Title>請輸入要購買的以太幣</Card.Title>
                    <Card.Text>單位使用：wei</Card.Text>
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Enter how much wei you want to buy..."
                        style={{textAlign: 'center'}}
                        onChange={this.setEther}
                      />
                    </InputGroup>
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
                <Card.Footer className={'bg-success text-white'} variant="flat">{`目前的以太幣：${this.state.balance} (wei)`}</Card.Footer>  
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

