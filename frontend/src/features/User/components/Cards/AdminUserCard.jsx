import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

//! imp Comps
import MenuButton from '../Buttons/MenuButton';

const AdminUserCard = ({ entity, handleShowModal }) => {
  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;

  return (
    <Card as="article" className="my-3 p-3 rounded card-admin-user">
      <Card.Header className="card-admin-user__header">
        <div className="card-admin-user__header__title-name">
          <Link to={`/admin/product/${entity._id}`}>
            <strong>{entity.username}</strong>{' '}
          </Link>

          <MenuButton
            handleSubmit={(typeAction) =>
              handleShowModal(typeAction, entity._id)
            }
          />
        </div>
      </Card.Header>
      <Card.Body>
        {/* {entity.image && (
            <Card.Img
              src={`${REACT_APP_SERVER}:${REACT_APP_PORT}/images/avatars/${entity.image}`}
              variant="top"
            />
          )} */}
        <Card.Title as={'div'} className="card-admin-title-user">
          <p>Số điện thoại: {entity.phoneNumber}</p>
          <p>Tên: {`${entity.firstName} ${entity.lastName}`}</p>
        </Card.Title>
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
