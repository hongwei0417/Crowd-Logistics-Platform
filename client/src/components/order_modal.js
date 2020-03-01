import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, ButtonGroup, Card, ListGroup, ListGroupItem, Modal } from 'react-bootstrap'
import { getOrder } from '../modules/eth'
import styles from '../css/modal.module.css'
import { updateOrder } from '../actions/txnAction'
import axios from 'axios'
import { transform_status_to_chinese } from '../modules/tools'
import { get_Status_number } from '../modules/tools'

const importStyles = () => {
  return (
    <style type="text/css">
      {`
      .order_img {
        height: 25vh !important;
      }
      `}
    </style>
  )
}

export class order_modal extends Component {

  state = {
    orderInfo: null,
    showModal: false
  }
  
  async componentDidMount() {
    const {currentOrder} = this.props

    let number = -1
    if(currentOrder) {
      number = get_Status_number(currentOrder.status)
    }

    if(number == 0) {
      const { uuid, txnTime } = currentOrder
      const orderInfo = await getOrder(uuid, txnTime)

      this.setState({
        orderInfo,
        showModal: true
      })
    }
    
  }

  async componentDidUpdate(prevProps, prevState) {

    const {currentOrder} = this.props

    let number = -1
    if(currentOrder) {
      number = get_Status_number(currentOrder.status)
    }
    //有訂單但沒顯示畫面
    if(number == 0  && !prevState.showModal && !this.state.showModal) { 
      const { uuid, txnTime } = currentOrder
      const orderInfo = await getOrder(uuid, txnTime)
      this.setState({
        orderInfo,
        showModal: true
      })
      return
    }

    //沒訂單但有顯示畫面
    if(typeof(maybeObject) == "null" && prevState.showModal) { 
      this.setState({
        orderInfo: null,
        showModal: false
      })
      return
    }

  }

  handleCommit = async (e) => {

    const { currentOrder, updateOrder } = this.props
    let status = null

    switch(e.target.value) {
      case "1":
        status = "refused"
        break
      case "2":
        status = "carrying"
        break
    }


    if(status) {
      const res = await axios.post('http://localhost:5000/orders/updateStatus', {
        orderId: currentOrder.id,
        status,
        who: 'driver',
        event: "updateOrder"
      })

      updateOrder(res.data, 'driver')
      this.setState({
        showModal: false,
        orderInfo: null,
      })
    }
    
  }

  number_to_date = (number) => {
    let date = new Date(parseInt(number));
    return date.toLocaleString();
  }

  render() {
    const { currentOrder } = this.props
    const { orderInfo, showModal } = this.state
    return (
      <Modal
        show={showModal}
        backdrop={false}
        className={`${styles.modal}`}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onShow={this.handleOrderShow}
        onEnter={this.handleOrderCome}
      >
        {importStyles()}
        <Modal.Body className='p-0'>
          { orderInfo ? 
            (<Card className='border-0'>
              <Card.Img variant="top" className='order_img' src="https://www.performancemagazine.org/wp-content/uploads/2019/07/perfect-order.jpg" />
              <Card.Body>
                <Card.Title className='font-weight-bold'>有一筆新的訂單</Card.Title>
                <Card.Text className='text-black-50'>
                  以下是訂單資訊，請確認後選擇是否接取
                </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>{`訂單編號： ${currentOrder.id}`}</ListGroupItem>
                <ListGroupItem>{`訂單狀態： ${transform_status_to_chinese(currentOrder.status)}`}</ListGroupItem>
                <ListGroupItem>{`寄件人： ${currentOrder.uuid.username}`}</ListGroupItem>
                <ListGroupItem>{`起始點： ${orderInfo[1]}`}</ListGroupItem>
                <ListGroupItem>{`目的地： ${orderInfo[2]}`}</ListGroupItem>
                <ListGroupItem>{`收件人： ${orderInfo[3]}`}</ListGroupItem>
                <ListGroupItem>{`聯繫方式： ${orderInfo[4]}`}</ListGroupItem>
                <ListGroupItem>{`運送方式： ${orderInfo[5] ? '機車' : '貨車'}`}</ListGroupItem>
                <ListGroupItem>{`是否為急件： ${orderInfo[6] ? '是' : '否'}`}</ListGroupItem>
                <ListGroupItem>{`貨物重量： ${orderInfo[7]}kg`}</ListGroupItem>
              </ListGroup>
              <ButtonGroup className="p-3">
                <Button type="radio" name="radio" variant="danger"  className='font-weight-bold' value="1" onClick={this.handleCommit}>
                  拒絕此單
                </Button>
                <Button type="radio" name="radio" variant="success"  className='font-weight-bold' value="2" onClick={this.handleCommit}>
                  接取此單
                </Button>
              </ButtonGroup>
            </Card>)
            : 
            <div>
              沒有訂單資訊
            </div>
          }
        </Modal.Body>
      </Modal>  
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
    firstLoading: state.userState.firstLoading,
    currentOrder: state.txnState.driver.currentOrder,

  }
}

const mapDispatchToProps  = dispatch => {
  return {
    dispatch,
    updateOrder: (order, who) => dispatch(updateOrder(order, who))
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(order_modal);

