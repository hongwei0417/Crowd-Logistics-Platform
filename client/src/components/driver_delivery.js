import React, { Component } from 'react'
import { Button, Table, DropdownButton, Dropdown, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'; 
import ethFile from '../eth.json';
import Transaction from '../contracts/Transaction.json'
import { getOrder } from '../modules/eth'
import { transform_status_to_chinese } from '../modules/tools'
import OrderDetails from './order_details' 



export class driver_delivery extends Component {

  state = {
    contract: null,
    order: null,
    orderInfo: null,
    loadingNumber: -1,
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

  search_order = async (order, n) => {
    
    this.setState({loadingNumber: n})
    const res = await axios.post('http://localhost:5000/orders/getOne', {
      orderId: order._id,
      population: ["uuid", "duid", "txnid"]
    })

    const orderDoc = res.data

    const orderInfo = await getOrder(orderDoc.uuid, orderDoc.txnTime)

    if(orderInfo) {
      this.setState({
        showModal: true,
        orderInfo,
        order: orderDoc,
        loadingNumber: -1
      })
    } else {
      alert('無法查看!')
    }
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
        status = 'being confirm'
        break;
      case '4':
        status = 'completed'
        break;
    }

    if(status) {
      const res = await axios.post('http://localhost:5000/orders/updateStatus', {
        orderId: id,
        status,
        who: "driver",
        event: "updateOrder"
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
      case 'being confirm':
        return '3'
      case 'completed':
        return '4'
      default:
        return '0'
    }

  }

  filter_color = (status) => {
    switch(status) {
      case 'carrying':
        return 'primary'
      case 'refused':
        return 'danger'
      case 'being confirm':
        return 'warning'
      case 'completed':
        return 'success'
      default:
        return 'secondary'
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
    const { orderList, orderInfo, order, loadingNumber } = this.state
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
                    <DropdownButton disabled={activeN == '4'} variant={color} title={transform_status_to_chinese(order.status)}>
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
                        >提交確認</Dropdown.Item>
                    </DropdownButton>
                  </td>
                  <td>
                    <Button
                      block
                      variant="secondary"
                      onClick={() => this.search_order(order, i)}
                    >
                      {
                        loadingNumber == i ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : null
                      }
                      {
                        loadingNumber == i ? 'Loading' : '點擊查看'
                      }
                    </Button>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
        { 
          orderInfo ? (
            <OrderDetails
              showModal={this.state.showModal}
              handleClose={this.handleClose.bind(this)}
              order={order}
              orderInfo={orderInfo}
            />
          ) : null
        }
      </div>
    )
  }

  handleClose = () => {
    this.setState({
      showModal: false,
      orderInfo: null,
      order: null
    })
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(driver_delivery)
