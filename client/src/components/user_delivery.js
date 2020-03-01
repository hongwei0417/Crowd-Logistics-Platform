import React, { Component } from 'react'
import { connect } from 'react-redux'
import CarryingPage from './UD_status_pages/carrying_page'
import ComfirmPage from './UD_status_pages/confirm_page'
import OrderPage from './UD_status_pages/order_page'
import ethFile from '../eth.json';
import Navbar from '../components/navbar.js'
import Modal from '../components/modal'
import Transaction from '../contracts/Transaction.json'


export class user_delivery extends Component {

  state = {
    contract: null
  }

  async componentDidUpdate() {
  }

  async componentDidMount() {
    const { web3 } = this.props

    const contract = new web3.eth.Contract(Transaction.abi, ethFile.transaction_addr);

    this.setState({ contract })
  }

  async componentWillUnmount() {
  }


  render() {
    const { contract } = this.state
    const { currentOrder, web3, accounts } = this.props
    if(contract) {
      if(currentOrder) {
        switch (currentOrder.status) {
          case "carrying":
            return <CarryingPage />
          case "being confirm":
            return <ComfirmPage />
        }
      }
      //預設頁面
      return (
        <OrderPage contract={contract} web3={web3} accounts={accounts}/>
      )
    } else {
      return (
        <div>
          <Modal
            show={true}
            backdrop={false}
          >
            <h1 className='text-center'>匯入合約中...</h1>
          </Modal>
        </div>
      )
    }
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(user_delivery)
