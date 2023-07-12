import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../../../API";

//! imp Utils
import { parseIntlNumber } from "../../../utils/parse";

const CartItemComponent = ({
  cart,
  cartItem,
  handleClickDecrementQuantity,
  handleClickIncrementQuantity,
  handleClickDeleteCartItem,
}) => {
  const [product, setProduct] = React.useState(null);

  const cartProductQuantity =
    cart.cartItems?.find((item) => item.product === cartItem.product)
      ?.quantity || 0;

  const isPurchasePossible = cartProductQuantity < product?.quantity;

  const total = cartItem.price * cartItem.quantity;

  React.useEffect(() => {
    async function loadProduct() {
      const response = await API.product.getProductById(cartItem.product);
      setProduct(response.data.product);
    }

    loadProduct();
  }, [cartItem]);

  return (
    <tr key={cartItem.productId}>
      <th scope="row">
        <div className="p-2">
          <Link to={`/products/${cartItem.slug}`}>
            <img
              src={cartItem.image}
              alt=""
              width="70"
              className="img-fluid rounded shadow-sm me-4"
            />
          </Link>
          <div className="ml-3 d-inline-block align-middle">
            <p className="mb-0">
              <Link to={`/products/${cartItem.slug}`}>{cartItem.name}</Link>
            </p>
            <span className="text-muted font-weight-normal font-italic">
              {cartItem.category?.name}
            </span>
          </div>
        </div>
      </th>
      <td className="align-middle text-end">
        <strong>{parseIntlNumber(cartItem.price)}</strong>
      </td>
      <td className="align-middle text-center">
        <div className="control-quantity">
          <Button
            className="px-2 py-0"
            disabled={cartProductQuantity === 1}
            onClick={() => handleClickDecrementQuantity(cartItem)}
          >
            <FontAwesomeIcon icon="fa-solid fa-caret-left" />
          </Button>
          <span className="mx-2">
            <strong>{cartItem.quantity}</strong>
          </span>
          <Button
            className="px-2 py-0"
            disabled={!isPurchasePossible}
            onClick={() => handleClickIncrementQuantity(cartItem)}
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
          onClick={() => handleClickDeleteCartItem(cartItem)}
        >
          <FontAwesomeIcon icon="fa-solid fa-trash" />
        </Button>
      </td>
    </tr>
  );
};

export default CartItemComponent;
