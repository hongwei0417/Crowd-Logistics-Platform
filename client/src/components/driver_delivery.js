import React, { Component } from 'react'
import { Button, Table, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import styles from '../css/Driver_delivery.module.css'
import axios from 'axios'; 
import ethFile from '../eth.json';
import Transaction from '../contracts/Transaction.json'
import { updateOrderList } from '../actions/txnAction'



export class driver_delivery extends Component {

  state = {
    contract: null,
    balance: "",
    loading: false,
    showModal: false,
  }

  constructor(props) {
    super(props)

  }

  componentDidMount = async () => {

    const { web3, user, updateOrder } = this.props

    const contract = new web3.eth.Contract(Transaction.abi, ethFile.transaction_addr);

    const res = await axios.post('http://localhost:5000/orders/get/driver', {
      uid: user._id,
      population: ["uuid"]
    })

    await updateOrder(res.data)

    console.log(res.data)
    // this.setState({ contract })

  };

  convert_date = (dateNumber) => {
    let d = new Date(parseInt(dateNumber)*1000)

    let dateString = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}號${d.getHours()}點${d.getMinutes()}`

    return dateString;
  }

  render() {
    const { orderList } = this.props
    return (
      <div>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th></th>
              <th>姓名</th>
              <th>電話</th>
              <th>交易時間</th>
              <th>查看詳情</th>
            </tr>
          </thead>
          <tbody>
          {
            orderList.map((order, i) => {
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{order.uuid.username}</td>
                  <td>{order.uuid.phone_number}</td>
                  <td>{this.convert_date(order.txnTime)}</td>
                  <td>
                    <Button>點擊查看</Button>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
    receipt: state.txnState.receipt,
    orderList: state.txnState.orderList,
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
    updateOrder: (list) => dispatch(updateOrderList(list)) 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(driver_delivery)
