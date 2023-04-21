import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

//! imp Comps
import MenuButton from '../Button/MenuButton';

const AdminUserCard = ({ entity, handleOpenModal }) => {
  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;
  const isAdmin = entity.roles?.map((role) => role.name).includes('admin');

  return (
    <Card as="article" className="my-3 p-3 rounded card-admin-user">
      <Card.Header className="card-admin-user__header">
        <div className="card-admin-user__header__title-name">
          <Link to={`/admin/users/${entity._id}/update`}>
            <strong>{entity.username}</strong>{' '}
          </Link>

          <MenuButton
            handleClickActionTypeSubmit={(actionType) =>
              handleOpenModal(actionType, [entity._id])
            }
          />
        </div>
      </Card.Header>
      <Link to={`/admin/users/${entity._id}/update`}>
        <Card.Body>
          {/* {entity.image && (
            <Card.Img
              src={`${REACT_APP_SERVER}:${REACT_APP_PORT}/images/avatars/${entity.image}`}
              variant="top"
            />
          )} */}
          <Card.Title as={'div'} className="card-admin-title-user">
            <p className="mb-1">
              Tên: {`${entity.firstName} ${entity.lastName}`}
            </p>
            <p className="mb-1">Số điện thoại: {entity.phoneNumber}</p>
            <p className="mb-1">
              Phân quyền: {`${isAdmin ? 'Admin' : 'User'}`}
            </p>
          </Card.Title>
        </Card.Body>
      </Link>

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
