import React, { Component } from 'react'
import { Table, Modal } from 'react-bootstrap'
import { transform_status_to_chinese, transform_unix_toLocal } from '../modules/tools'


const order_details = (props) => {

  const { showModal, handleClose, order, orderInfo } = props

  const className = 'text-center align-middle'

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
          <Table responsive striped bordered hover variant="dark" className='m-0'>
            <tbody>
              <tr>
                <td className={className} colSpan="4">訂單編號</td>
                <td className={className} colSpan="11">{order.id}</td>
              </tr>
              <tr>
                <td className={className} colSpan="4">訂單日期</td>
                <td className={className} colSpan="11">{transform_unix_toLocal(order.txnTime)}</td>
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
                <td className={className} colSpan="2">{order.txnid.receipt.blockNumber}</td>
                <td className={className} colSpan="2">交易序號</td>
                <td className={className} colSpan="9">{order.txnid.receipt.transactionHash}</td>
              </tr>
              <tr>
                <td className={className} colSpan="2">司機姓名</td>
                <td className={className} colSpan="5">{order.duid.username}</td>
                <td className={className} colSpan="2">司機帳戶</td>
                <td className={className} colSpan="6">{order.duid.account.address}</td>
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
                <td className={className} colSpan="12">{transform_status_to_chinese(order.status)}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  )


}

export default order_details;
