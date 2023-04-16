import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//! imp Utils
import { parseIntlNumber } from '../../../utils/parse';

const REACT_APP_SERVER = 'http://127.0.0.1';
const REACT_APP_PORT = 5000;

const CartItemComponent = ({
  entity,
  handleClickDecrementQuantity,
  handleClickIncrementQuantity,
  handleClickDeleteCartItem,
}) => {
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;
  const total = entity.price * entity.quantity;
  return (
    <tr key={entity.productId}>
      <th scope="row">
        <div className="p-2">
          <Link to={`/products/${entity.slug}`}>
            <img
              src={imagesUrl + entity.image}
              alt=""
              width="70"
              className="img-fluid rounded shadow-sm"
            />
          </Link>
          <div className="ml-3 d-inline-block align-middle">
            <p className="mb-0">
              <Link to={`/products/${entity.slug}`}>{entity.name}</Link>
            </p>
            <span className="text-muted font-weight-normal font-italic">
              {entity.category?.name}
            </span>
          </div>
        </div>
      </th>
      <td className="align-middle text-end">
        <strong>{parseIntlNumber(entity.price)}</strong>
      </td>
      <td className="align-middle text-center">
        <div className="control-quantity">
          <Button
            className="px-2 py-0"
            onClick={() => handleClickDecrementQuantity(entity)}
          >
            <FontAwesomeIcon icon="fa-solid fa-caret-left" />
          </Button>
          <span className="mx-2">
            <strong>{entity.quantity}</strong>
          </span>
          <Button
            className="px-2 py-0"
            onClick={() => handleClickIncrementQuantity(entity)}
          >
            <FontAwesomeIcon icon="fa-solid fa-caret-right" />
          </Button>
        </div>
      </td>
      <td className="align-middle text-end">
        <strong>{parseIntlNumber(total)}</strong>
      </td>

      <td className="align-middle text-center">
        <Button
          type="button"
          variant="light"
          onClick={() => handleClickDeleteCartItem(entity)}
        >
          <FontAwesomeIcon icon="fa-solid fa-trash" />
        </Button>
      </td>
    </tr>
  );
};

export default CartItemComponent;
