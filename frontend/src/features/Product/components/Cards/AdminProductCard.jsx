import React from 'react';
import { Card, Button, FormCheck } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//! imp comps/icons
import TrashIcon from '../../../../components/Icons/TrashIcon';
import EditRegularIcon from '../../../../components/Icons/EditRegularIcon';

const AdminProductCard = ({ product, checkProductIds, handleRemove, handleCheckChange }) => {
  return (
    <Card as="article" className="my-3 p-3 rounded card-admin-product">
      <Card.Header>
        <FormCheck inline id={product._id} checked={checkProductIds.includes(product._id)} onChange={handleCheckChange} />
      </Card.Header>
      <Card.Body>
        <Link to={`/admin/product/${product._id}`}>
          {product.images.length && (
            <Card.Img src={product.images[0]} variant="top" />
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
          onClick={() => handleRemove(product._id)}
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
