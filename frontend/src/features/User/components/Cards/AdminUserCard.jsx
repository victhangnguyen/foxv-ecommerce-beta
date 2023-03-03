import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

//! imp Comps
import MenuButton from '../Buttons/MenuButton';

const AdminUserCard = ({ entity, handleShowDeleteModal }) => {
  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;

  const handleDeleteUser = () => {
    handleShowDeleteModal('single', entity._id);
  };

  return (
    <Card as="article" className="my-3 p-3 rounded card-admin-user">
      <Card.Header className="card-admin-user__header">
        <MenuButton handleDeleteUser={handleDeleteUser} />
      </Card.Header>
      <Card.Body>
        <Link to={`/admin/product/${entity._id}`}>
          {/* {entity.image && (
            <Card.Img
              src={`${REACT_APP_SERVER}:${REACT_APP_PORT}/images/avatars/${entity.image}`}
              variant="top"
            />
          )} */}
          <Card.Title as={'div'} className="card-admin-title-user">
            <strong>{entity.name}</strong>
          </Card.Title>
        </Link>
      </Card.Body>
      {/* <Card.Footer as={'div'} className="d-flex">
        <Link to={`/admin/product/${product._id}`}>
          <Button size="sm" variant={'warning'}>
            <span className="me-1">
              <EditRegularIcon size={'0.75rem'} />
            </span>
            Chỉnh sửa
          </Button>
        </Link>
        <Button
          size="sm"
          variant={'danger'}
          onClick={() => handleShowDeleteModal('single', product._id)}
        >
          <span className="me-1">
            <TrashIcon color="white" size={'0.75rem'} />
          </span>
          Xóa
        </Button>
      </Card.Footer> */}
    </Card>
  );
};

export default AdminUserCard;
