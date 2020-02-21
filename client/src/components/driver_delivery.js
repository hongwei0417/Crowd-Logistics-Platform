import React, { Component } from 'react'
import { Button, Table, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import styles from '../css/Driver_delivery.module.css'
import axios from 'axios'; 
import ethFile from '../eth.json';
import Transaction from '../contracts/Transaction.json'
import { transform_status } from '../modules/tools'



export class driver_delivery extends Component {

  state = {
    contract: null,
    balance: "",
    loading: false,
    showModal: false,
    orderList: []
  }

  componentDidMount = async () => {

    const { web3, user } = this.props

    const contract = new web3.eth.Contract(Transaction.abi, ethFile.transaction_addr);

    const res = await axios.post('http://localhost:5000/orders/get/driver', {
      uid: user._id,
      population: ["uuid"]
    })

    this.setState({
      orderList: res.data,
      contract
    })

    console.log(res.data)
  };

  convert_date = (dateNumber) => {
    let d = new Date(parseInt(dateNumber)*1000)
    let hours = ("0" + d.getHours()).slice(-2);
    let minutes = ("0" + d.getMinutes()).slice(-2);

    let dateString = `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} \xa0\xa0${hours}:${minutes}`

    return dateString;
  }

  render() {
    const { orderList } = this.state
    return (
      <div>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th></th>
              <th>姓名</th>
              <th>電話</th>
              <th>訂單狀態</th>
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
                  <td>{transform_status(order.status)}</td>
                  <td>{this.convert_date(order.txnTime)}</td>
                  <td>
                    <Button variant="secondary" >點擊查看</Button>
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
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(driver_delivery)
