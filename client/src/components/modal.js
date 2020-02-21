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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onShow={props.onShow}
      onEnter={props.onEnter}
    >
      <Modal.Header >
        <Modal.Title className='font-weight-bold'>
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {content}
      </Modal.Body>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;