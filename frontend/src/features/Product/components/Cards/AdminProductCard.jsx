import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//! imp comps/icons
import TrashIcon from '../../../../components/Icons/TrashIcon';
import EditRegularIcon from '../../../../components/Icons/EditRegularIcon';

const AdminProductCard = ({ product, index, handleRemove }) => {
  return (
    <Card as="article" className="my-3 p-3 rounded card-admin-product">
      <Link to={`/product/${product._id}`}>
        <Card.Img
          // src={`http://127.0.0.1:5000/${product.image}`}
          variant="top"
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
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
