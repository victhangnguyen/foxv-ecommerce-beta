import React from 'react';
import { Card, Button, FormCheck } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//! imp comps/icons
import TrashIcon from '../../../../components/Icon/TrashIcon';
import EditRegularIcon from '../../../../components/Icon/EditRegularIcon';

const AdminProductCard = ({
  product,
  checkedProductIds,
  handleShowDeleteModal,
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
          checked={checkedProductIds.includes(product._id)}
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
      </Card.Footer>
    </Card>
  );
};

export default AdminProductCard;
