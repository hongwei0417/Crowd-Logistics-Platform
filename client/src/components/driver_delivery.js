import React, { Component } from 'react'
import { Button, Table, DropdownButton, Dropdown } from 'react-bootstrap'
import { connect } from 'react-redux'
import styles from '../css/Driver_delivery.module.css'
import axios from 'axios'; 
import ethFile from '../eth.json';
import Transaction from '../contracts/Transaction.json'
import { transform_status } from '../modules/tools'



export class driver_delivery extends Component {

  state = {
    contract: null,
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

  search_orderInfo = async() => {

  }

  update_status = async(e, n, id) => {

    let status = null
    let orderList = this.state.orderList
    switch(e.target.value) {
      case '1':
        status = 'carrying'
        break;
      case '2':
        status = 'refused'
        break;
      case '3':
        status = 'completed'
        break;
    }

    if(status) {
      const res = await axios.post('http://localhost:5000/orders/updateStatus', {
        orderId: id,
        status
      })

      orderList[n] = res.data

      this.setState({orderList})
    }
  }

  filter_active = (status) => {

    switch(status) {
      case 'carrying':
        return '1'
      case 'refused':
        return '2'
      case 'completed':
        return '3'
      default:
        return '1'
    }

  }

  filter_color = (status) => {
    switch(status) {
      case 'carrying':
        return 'primary'
      case 'refused':
        return 'danger'
      case 'completed':
        return 'success'
      default:
        return 'primary'
    }
  }


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
              <th>交易時間</th>
              <th>訂單狀態</th>
              <th>查看詳情</th>
            </tr>
          </thead>
          <tbody>
          {
            orderList.map((order, i) => {
              const activeN = this.filter_active(order.status)
              const color = this.filter_color(order.status)
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{order.uuid.username}</td>
                  <td>{order.uuid.phone_number}</td>
                  <td>{this.convert_date(order.txnTime)}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant={color}>{transform_status(order.status)}</Dropdown.Toggle>
                      <Dropdown.Menu className="bg-light">
                        <Dropdown.Item 
                          as="button"
                          value="1"
                          active={activeN == '1'}
                          onClick={(e) => this.update_status(e, i, order.id)}
                        >運送中</Dropdown.Item>
                        <Dropdown.Item 
                          as="button"
                          value="2"
                          active={activeN == '2'}
                          onClick={(e) => this.update_status(e, i, order.id)}
                        >放棄訂單</Dropdown.Item>
                        <Dropdown.Item 
                          as="button"
                          value="3"
                          active={activeN == '3'}
                          onClick={(e) => this.update_status(e, i, order.id)}
                        >訂單完成</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Button variant="secondary" block onClick={this.search_orderInfo}>點擊查看</Button>
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
