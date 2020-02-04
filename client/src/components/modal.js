import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

function MyVerticallyCenteredModal(props) {
  let content = props.children
  return (
    <Modal
      show={props.show}
      backdrop={props.backdrop}
      className={props.className}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onShow={props.onShow}
    >
      <Modal.Header>
        <Modal.Title>
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