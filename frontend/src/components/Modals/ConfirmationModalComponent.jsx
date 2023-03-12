import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModalComponent = ({
  showModal,
  handleHideModal,
  handleSubmit,
  message,
  title,
  nameButton = 'OK',
  variant = 'success',
}) => {
  return (
    <Modal show={showModal} onHide={handleHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={`alert ${variant ? 'alert-' + variant : null}`}>
          {message}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={handleHideModal}>
          Cancel
        </Button>
        <Button variant={variant} onClick={() => handleSubmit()}>
          {nameButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModalComponent;
