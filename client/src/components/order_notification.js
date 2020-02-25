import React, { Component } from 'react'
import { Button, Toast } from 'react-bootstrap'
import { connect } from 'react-redux'



export class order_notification extends Component {

  async componentDidUpdate() {

  }

  render() {
    const { currentOrder, receipt } = this.props
    return (
      <Toast className='position-fixed' style={{top: '10vh', right: '20px', 'zIndex': '10'}}>
        <Toast.Header>
          <strong className="mr-auto">{`訂單已完成`}</strong>
          <small>{currentOrder.txnTime}</small>
        </Toast.Header>
        <Toast.Body className='pr-4'>    
          <span>您的訂單資訊如下</span>
          <div>{`訂單編號: ${currentOrder.id}`}</div>
          <div>{`區塊鏈交易序號`}</div>
          <div>{`司機地址`}</div>
          <a href='#' className='float-right'>123</a>
          
        </Toast.Body>
      </Toast>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
    orderComing: state.txnState.orderComing,
    firstLoading: state.userState.firstLoading,
    currentOrder: state.txnState.currentOrder
  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(order_notification);

