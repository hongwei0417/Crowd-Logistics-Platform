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
              <th colSpan="15" className={className}>訂單內容</th>
            </tr>
          </thead>
          {orderInfo ? (
            <tbody>
              <tr>
                <td className={className} colSpan="4">訂單編號</td>
                <td className={className} colSpan="11">{currentOrder.id}</td>
              </tr>
              <tr>
                <td className={className} colSpan="4">訂單日期</td>
                <td className={className} colSpan="11">{this.number_to_date(currentOrder.txnTime)}</td>
              </tr>
              <tr>
                <td className={className} colSpan="3">貨物重量</td>
                <td className={className} colSpan="3">{`${orderInfo[7]}kg`}</td>
                <td className={className} colSpan="3">運送方式</td>
                <td className={className} colSpan="2">{orderInfo[5] ? '機車' : '貨車'}</td>
                <td className={className} colSpan="3">是否為急件</td>
                <td className={className} colSpan="1">{orderInfo[6] ? '是' : '否'}</td>
              </tr>
              <tr>
                <td className={className} colSpan="2">區塊編號</td>
                <td className={className} colSpan="2">{currentOrder.txnid.receipt.blockNumber}</td>
                <td className={className} colSpan="2">交易序號</td>
                <td className={className} colSpan="9">{currentOrder.txnid.receipt.transactionHash}</td>
              </tr>
              <tr>
                <td className={className} colSpan="2">司機姓名</td>
                <td className={className} colSpan="5">{currentOrder.duid.username}</td>
                <td className={className} colSpan="2">司機帳戶</td>
                <td className={className} colSpan="6">{currentOrder.duid.account.address}</td>
              </tr>
              <tr>
                <td className={className} colSpan="3">收貨地點</td>
                <td className={className} colSpan="12">{orderInfo[1]}</td>
              </tr>
              <tr>
                <td className={className} colSpan="3">送貨地點</td>
                <td className={className} colSpan="12">{orderInfo[2]}</td>
              </tr>
              <tr>
                <td className={className} colSpan="2">收件人</td>
                <td className={className} colSpan="5">{orderInfo[3]}</td>
                <td className={className} colSpan="2">聯繫方式</td>
                <td className={className} colSpan="6">{orderInfo[4]}</td>
              </tr>
              <tr>
                <td className={className} colSpan="3">訂單狀態</td>
                <td className={className} colSpan="12">{transform_status_to_chinese(currentOrder.status)}</td>
              </tr>
              <tr>
                <td colSpan="15">
                  <Button block variant="warning" className="font-weight-bold" onClick={this.handleConfirm}>確認訂單</Button>
                </td>
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
