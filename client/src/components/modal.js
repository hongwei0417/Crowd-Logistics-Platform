import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'
import styles from '../css/modal.module.css'

function MyVerticallyCenteredModal(props) {
  let content = props.children
  return (
    <Modal
      show={props.show}
      backdrop={props.backdrop}
      className={`${props.className} ${styles.modal}`}
      size={props.size ? props.size : 'lg'}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onShow={props.onShow}
      onEnter={props.onEnter}
    >
        {
          props.title ? 
            <Modal.Header >
              <Modal.Title className='font-weight-bold'>
                {props.title}
              </Modal.Title>
            </Modal.Header>
            : null
        }  
      <Modal.Body>
        {content}
      </Modal.Body>
      {
        props.footer ? (
          <Modal.Footer className='d-flex justify-content-between'>
            <Button variant="secondary" onClick={() => props.handleClose()}>取消</Button>
            <Button variant="primary" disabled={!props.sufficient} onClick={() => props.handleCommit()}>確認</Button>
          </Modal.Footer>
        ) : null
      }
    </Modal>
  );
}

export default MyVerticallyCenteredModal;