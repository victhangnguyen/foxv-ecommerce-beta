import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, FormCheck } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import constants from '../../../../constants';
//! imp comps/icons

const AdminProductCard = ({
  product,
  selectedIds,
  handleOpenModal,
  handleCheckChange,
}) => {
  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;
  
  return (
    <Card as="article" className="my-3 p-3 rounded card-admin-product">
      <Card.Header>
        <FormCheck
          inline
          id={product._id}
          checked={selectedIds?.includes(product._id)}
          onChange={handleCheckChange}
        />
      </Card.Header>
      <Card.Body>
        <Link to={`/admin/products/${product._id}/update`}>
          {product.images.length && (
            <Card.Img
              src={
                Array.isArray(product.images)
                  ? imagesUrl + product.images[0]
                  : product.images[0]
              }
              variant="top"
            />
          )}
          <Card.Title as={'div'} className="card-admin-title-product">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
      </Card.Body>
      <Card.Footer as={'div'} className="d-flex">
        <Link to={`/admin/products/${product._id}/update`}>
          <Button size="sm" variant={'warning'}>
            <span className="me-1">
              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />{' '}
            </span>
            Chỉnh sửa
          </Button>
        </Link>
        <Button
          size="sm"
          variant={'danger'}
          onClick={() => handleOpenModal(constants.product.actionTypes.DELETE_ONE_PRODUCT, product._id)}
        >
          <span className="me-1">
            <FontAwesomeIcon icon="fa-solid fa-trash" />{' '}
          </span>
          Xóa
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default AdminProductCard;
