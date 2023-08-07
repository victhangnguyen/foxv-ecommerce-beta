import React from "react";
import { parseIntlNumber } from "../../../../utils/parse";
//! imp Comps
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
//! imp Hooks
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//! imp Actions
import { addToCart, removeItem } from "../../../Cart/CartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //! rootState
  const cart = useSelector((state) => state.cart);

  const mainImageUrl = product.images[0];

  const isAddedToCard = cart.cartItems
    ?.map((item) => item.product)
    .includes(product._id);

  const cartProductQuantity =
    cart.cartItems?.find((item) => item.product === product._id)?.quantity || 0;

  const isPurchasePossible = cartProductQuantity < product.quantity;

  const [qty, setQty] = React.useState(1);

  function handleClickAddToCart() {
    const cartItem = {
      product: product._id,
      quantity: 1,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.images[0],
      price: product.price,
    };

    if (isPurchasePossible) {
      dispatch(addToCart(cartItem));
    }
  }

  function handleClickBuyNow() {
    navigate(
      isAddedToCard ? `/cart` : `/cart/${product?._id}?qty=${qty ? qty : 1}`
    );
  }

  return (
    <Card
      className={`product-card mb-4 ${`${
        !product.quantity ? "sold-out" : isAddedToCard ? "sold" : ""
      }`}`}
    >
      <div className="product-image">
        <Link to={`/products/${product.slug}`} className="image">
          <img className="img-1" src={mainImageUrl} />
        </Link>

        <ul className="product-links">
          <li className={""}>
            <button className={"btn-buy-now"} onClick={handleClickBuyNow}>
              <i className="fa fa-shopping-bag"></i>{" "}
              {isAddedToCard ? "Xem giỏ" : "Mua ngay"}
            </button>
          </li>
          <li>
            <button
              className={
                product?.quantity === 0
                  ? "btn-sold-out"
                  : isPurchasePossible
                  ? null
                  : `btn-disable`
              }
              disabled={!isPurchasePossible}
              onClick={handleClickAddToCart}
            >
              <i className="fa fa-shopping-bag"></i>{" "}
              {product?.quantity === 0
                ? "Đã bán hết"
                : isPurchasePossible
                ? "Thêm vào Giỏ"
                : `Chỉ còn ${cartProductQuantity} SP`}
            </button>
          </li>
        </ul>
      </div>
      <div className="product-content">
        <h3 className="title">
          <Link to={`/products/${product.slug}`}>{product?.name}</Link>
        </h3>
        <div className="price">{parseIntlNumber(product?.price)}</div>
      </div>
    </Card>
  );
};

export default ProductCard;
