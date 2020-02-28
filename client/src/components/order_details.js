import React, { Component } from 'react'
import { Button, Table, ButtonGroup, Card, ListGroup, ListGroupItem, Modal } from 'react-bootstrap'
import { transform_status_to_chinese, get_Status_number } from '../modules/tools'


const order_details = (props) => {

  const { showModal, handleClose, currentOrder, orderInfo } = props

  const className = 'text-center align-middle'
  
  const number_to_date = (number) => {
    let date = new Date(parseInt(number));
    return date.toLocaleString();
  }

  return (
    <div>
      <Modal
        backdrop
        show={showModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton className='bg-warning border-0'>
          <Modal.Title className='font-weight-bold'>
            您的訂單資訊
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <Table striped bordered hover variant="dark" className='m-0'>
            <tbody>
              <tr>
                <td className={className}>訂單編號</td>
                <td colSpan="5" className={className}>{currentOrder.id}</td>
              </tr>
              <tr>
                <td className={className}>訂單日期</td>
                <td colSpan="5" className={className}>{number_to_date(currentOrder.txnTime)}</td>
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
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  )


}

export default order_details;
