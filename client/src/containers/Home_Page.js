import React, { Component } from 'react';
import { FormControl, ListGroup, Jumbotron, Button, Form, Table } from 'react-bootstrap'
import Navbar from '../components/navbar.js'
import Modal from '../components/modal'
import { connect } from 'react-redux'
import getWeb3 from '../utils/getWeb3'
import { getOrder } from '../modules/eth'
import OrderDetails from '../components/order_details' 
import axios from 'axios'; 
import { transform_unix_toLocal } from '../modules/tools'



class Home_Page extends Component {
  state = {
    txnHash: "",
    transactions: [],
    web3: null,
    orderData: null,
    showModal: false,
    loading: false,
  }

  componentDidMount = async () => {

    const { user } = this.props
    
    if(user) {
      const web3 = await getWeb3();
      const res = await axios.post(`http://localhost:5000/transactions/get/${user._id}`)
      console.log(res.data)
    
      this.setState({
        transactions: Object.values(res.data),
        web3
      })
    }
  };

  search_txn = async () => {
    const { user } = this.props
    const { txnHash } = this.state

    console.log(txnHash)

    const res = await axios.post(`http://localhost:5000/transactions/get/${user._id}`)

    const txn_result = res.data.filter((txn, i) => {
      if(txn.receipt.transactionHash == txnHash) {
        return txn
      }
    })

    this.setState({transactions: txn_result})
  }

  get_order = async (txn) => {

    if(!this.state.loading) {
      this.setState({loading: true})

      const { user } = this.props
      const orderInfo = await getOrder(user, txn.txnTime)
      const res = await axios.post('http://localhost:5000/orders/getOneByTxn', {
        uid: user._id,
        txnTime: txn.txnTime,
        population: ["uuid", "duid", "txnid"]
      })

      this.setState({
        loading: false,
        showModal: true,
        orderData: {
          order: res.data,
          orderInfo
        }
      })
    }
  }

  set_txnHash = (e) => {
    this.setState({txnHash: e.target.value})
  }

  handleClose = () => {
    this.setState({
      showModal: false,
      orderData: null
    })
  }
  
  
  render() {
    const { web3, orderData } = this.state
    const { user, history } = this.props
    if(user) {
      if(web3) {
        return (
          <div>
            <Navbar />
            <Jumbotron>
              <h1>Hello, {user.username} !</h1>
              <Form inline className='ml-0 mt-3 mb-3'>
                <FormControl type="text" placeholder="Input the transactionHash" className="mr-2" style={{width: '85%'}} onChange={this.set_txnHash}/>
                <Button variant="success" onClick={this.search_txn}>Search</Button>
              </Form>
              <p>
                Your transaction records：
              </p>
              <ListGroup>
                <ListGroup.Item action variant="success">Blockchain address： {user.account.address}</ListGroup.Item>
                <ListGroup.Item action variant="info">Private key： {user.account.privateKey}</ListGroup.Item>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th></th>
                      <th>交易序號</th>
                      <th>交易時間</th>
                      <th>花費</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.transactions.map((txn, i) => {
                        return (
                          <tr key={i} onClick={() => this.get_order(txn)} style={{cursor: 'pointer'}}>
                            <td>{i+1}</td>
                            <td>{txn.receipt.transactionHash}</td>
                            <td>{transform_unix_toLocal(txn.txnTime)}</td>
                            <td>{txn.receipt.gasUsed}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </ListGroup>
            </Jumbotron>
            { 
              orderData ? (
                <OrderDetails
                  showModal={this.state.showModal}
                  handleClose={this.handleClose.bind(this)}
                  order={orderData.order}
                  orderInfo={orderData.orderInfo}
                />
              ) : null
            }
          </div>
        );
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
    } else {
      history.replace({pathname: '/'})
      return null;
    }
  }
}
const mapStateToProps = state => {
  return {
    user: state.userState.user
  }
}


export default connect(mapStateToProps)(Home_Page);