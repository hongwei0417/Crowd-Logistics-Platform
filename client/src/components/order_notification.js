import React, { Component } from 'react'
import { Button, Toast } from 'react-bootstrap'
import { connect } from 'react-redux'
import { clearTXN } from '../actions/txnAction'
import { transform_status_to_chinese, get_Status_number } from '../modules/tools'
import OrderDetails from './order_details'
import { getOrder } from '../modules/eth'






export class order_notification extends Component {

  state = {
    showModal: false,
    orderInfo: null,
    showToast: false,
    headerMsg: "",
    status: 0,
  }

  async componentDidMount() {
    this.handleOrderStatus()
  }

  async componentDidUpdate(pp, ps) {
    if(ps.showToast == this.state.showToast && !ps.showToast) {
      this.handleOrderStatus()
    }
  }

  handleOrderStatus = () => {
    const { currentOrder } = this.props
    if(currentOrder) {
      if(currentOrder.status == 'completed') {
        this.setState({
          showToast: true,
          headerMsg: "您的訂單已完成!",
          status: 1,
        })
      } else if(currentOrder.status == 'refused') {
        this.setState({
          showToast: true,
          headerMsg: "您的訂單遭到拒絕!",
          status: 2,
        })
      }
    }
    
  }

  handleClose = () => {
    const { clearTXN, socket } = this.props

    socket.removeEvent('updateSendingStatus')
    //清空交易狀態
    clearTXN()

    this.setState({
      showToast: false
    })

  }

  handleSeeOrder = async () => {
    const { user, currentOrder } = this.props
    const orderInfo = await getOrder(user, currentOrder.txnTime)

    if(orderInfo) {
      this.setState({
        showModal: true,
        orderInfo
      })
    } else {
      alert('無法查看!')
    }
  }

 
  render() {
    if(this.state.showToast) {
      const { headerMsg, status, orderInfo } = this.state
      const { currentOrder } = this.props
      const { blockNumber, transactionHash } = currentOrder.txnid.receipt
      return (
        <div>
          <Toast
            className='position-fixed'
            style={{top: '10vh', right: '20px', 'zIndex': '10'}}
            show={this.state.showToast}
            onClose={this.handleClose}
            animation={true}
          >
            <Toast.Header>
              <div className='d-flex w-100 justify-content-between align-items-center'>
                <strong className={`mr-5 d-inline-block ${status == 1 ? 'text-success' : 'text-danger'}`}>{headerMsg}</strong>
                <small>{this.convert_date(currentOrder.txnTime)}</small>
              </div>
            </Toast.Header>
            <Toast.Body className='pr-4'>
              <div>{`訂單編號：${currentOrder.id}`}</div>
              <div>{`司機姓名：${currentOrder.duid.username}`}</div>
              <div>{`連絡電話：${currentOrder.duid.phone_number}`}</div>
              {status == 1 ? (
                <div>
                  <div>{`區塊編號：${blockNumber}`}</div>
                  <div className='text-truncate'>{`交易序號：${transactionHash}`}</div>
                  <div className='text-truncate'>{`司機地址：${currentOrder.duid.account.address}`}</div>
                  <Button variant="link" className='float-right font-weight-bold pr-0' onClick={this.handleSeeOrder}>查看訂單</Button>
                </div>
              ) : null}
            </Toast.Body>
          </Toast>
          { 
            orderInfo ? (
              <OrderDetails
                showModal={this.state.showModal}
                handleClose={this.handleClose.bind(this)}
                currentOrder={currentOrder}
                orderInfo={orderInfo}
              />
            ) : null
          }
        </div>
      )
    } else return null;
  }
  
  convert_date = (d) => {
    const date = new Date(parseInt(d)*1000)
    return date.toLocaleString()
  }

  handleClose = () => {
    this.setState({showModal: false})
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
    firstLoading: state.userState.firstLoading,
    currentOrder: state.txnState.sender.currentOrder,
    socket: state.toolState.socket
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
    clearTXN: () => dispatch(clearTXN())
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(order_notification);

