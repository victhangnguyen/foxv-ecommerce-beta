import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModalComponent = ({
  showModal,
  handleHideModal,
  handleSubmitDelete,
  message,
  title,
}) => {
  return (
    <Modal show={showModal} onHide={handleHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger">{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={handleHideModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => handleSubmitDelete()}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModalComponent;
