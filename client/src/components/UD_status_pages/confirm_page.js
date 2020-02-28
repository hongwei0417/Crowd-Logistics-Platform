import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Jumbotron, Button } from 'react-bootstrap'
import { getOrder } from '../../modules/eth'
import { transform_status_to_chinese } from '../../modules/tools'
import axios from 'axios'; 
import { updateOrder } from '../../actions/txnAction'

export class confirm_page extends Component {

  state = {
    className: 'text-center align-middle',
    orderInfo: null
  }

  async componentDidMount() {
    const { currentOrder, user } = this.props
    const orderInfo = await getOrder(user, currentOrder.txnTime)

    this.setState({orderInfo})
  }

  handleConfirm = async () => {
    const { currentOrder, updateOrder } = this.props
    
    const res = await axios.post('http://localhost:5000/orders/updateStatus', {
      orderId: currentOrder.id,
      status: "completed",
      who: "sender",
      event: 'confirmOrder'
    })
    //更新狀態
    updateOrder(res.data, "sender")
  }

  render() {
    const { orderInfo, className } = this.state
    const { currentOrder } = this.props
    return (
      <Jumbotron className='vh-100'>
        <Table responsive  striped bordered hover variant="dark">
          <thead>
            <tr>
              <th colSpan="3" className='text-center'>訂單內容</th>
            </tr>
          </thead>
          {orderInfo ? (
            <tbody>
              <tr>
                <td className={className}>訂單編號</td>
                <td colSpan="5" className={className}>{currentOrder.id}</td>
              </tr>
              <tr>
                <td className={className}>訂單日期</td>
                <td colSpan="5" className={className}>{this.number_to_date(currentOrder.txnTime)}</td>
              </tr>
              <tr>
                <td className={className}>訂單狀態</td>
                <td colSpan="5" className={className}>{transform_status_to_chinese(currentOrder.status)}</td>
              </tr>
              <tr>
                <td className={className}>區塊編號</td>
                <td className={className}>{currentOrder.txnid.receipt.blockNumber}</td>
                <td className={className}>交易序號</td>
                <td className={className}>{currentOrder.txnid.receipt.transactionHash}</td>
              </tr>
              <tr>
                <td className={className}>司機姓名</td>
                <td className={className}>{currentOrder.duid.username}</td>
                <td className={className}>司機帳戶</td>
                <td className={className}>{currentOrder.duid.account.address}</td>
              </tr>
              <tr>
                <td className={className}>收貨地點</td>
                <td colSpan="5" className={className}>{orderInfo[1]}</td>
              </tr>
              <tr>
                <td className={className}>送貨地點</td>
                <td colSpan="5" className={className}>{orderInfo[2]}</td>
              </tr>
              <tr>
                <td className={className}>收件人</td>
                <td colSpan="5" className={className}>{orderInfo[3]}</td>
              </tr>
              <tr>
                <td className={className}>聯繫方式</td>
                <td colSpan="5" className={className}>{orderInfo[4]}</td>
              </tr>
              <tr>
                <td className={className}>運送方式</td>
                <td colSpan="5" className={className}>{orderInfo[5] ? '機車' : '貨車'}</td>
              </tr>
              <tr>
                <td className={className}>是否為急件</td>
                <td colSpan="5" className={className}>{orderInfo[6] ? '是' : '否'}</td>
              </tr>
              <tr>
                <td className={className}>貨物重量</td>
                <td colSpan="5" className={className}>{`${orderInfo[7]}kg`}</td>
              </tr>
            </tbody>
          ): null}
        </Table>
      </Jumbotron>
    )
  }

  number_to_date = (number) => {
    let date = new Date(parseInt(number));
    return date.toLocaleString();
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

export default connect(mapStateToProps, mapDispatchToProps)(confirm_page)
