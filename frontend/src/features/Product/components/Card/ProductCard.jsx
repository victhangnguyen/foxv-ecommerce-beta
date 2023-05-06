import React from 'react';
import { parseIntlNumber } from '../../../../utils/parse';
//! imp Comps
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
//! imp Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//! imp Actions
import { addToCart, removeItem } from '../../../Cart/CartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //! rootState
  const cart = useSelector((state) => state.cart);

  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;

  const isAddedToCard = cart.cartItems
    ?.map((item) => item.product)
    .includes(product._id);

  //! localState
  const [qty, setQty] = React.useState(1);

  function handleClickAddToCart() {
    // action.payload ~ { _id, title, image, price}
    const cartItem = {
      product: product._id,
      quantity: 1,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.images[0],
      price: product.price,
    };
    dispatch(addToCart(cartItem));
  }

  function handleClickRemoveItem() {
    dispatch(removeItem(product._id));
  }

  function handleClickBuyNow() {
    navigate(
      isAddedToCard ? `/cart` : `/cart/${product?._id}?qty=${qty ? qty : 1}`
    );
  }

  return (
    // <Card as="article" className="my-3 p-3 rounded card-product">
    //   <Link to={`/products/${product.slug}`}>
    //     <Card.Img src={imagesUrl + product.images[0]} variant="top" />
    //   </Link>
    //   <Card.Body>
    //     <Link to={`/products/${product.slug}`}>
    //       <Card.Title as={'div'}>{product.name}</Card.Title>
    //     </Link>
    //     <Card.Text as={'div'}>
    //       {/* <RatingComponent
    //       value={product.rating}
    //       text={`${product.numReviews} reviews `}
    //     /> */}
    //     </Card.Text>
    //     <Card.Text as={'h5'}>{product.price}</Card.Text>
    //   </Card.Body>
    //   <Card.Footer as={'div'} className="d-flex">
    //     <Button
    //       size="sm"
    //       variant={isAddedToCard ? 'warning' : 'primary'}
    //       onClick={handleClickBuyNow}
    //     >
    //       {isAddedToCard ? 'Xem giỏ' : 'Mua ngay'}
    //     </Button>
    //     <Button
    //       size="sm"
    //       variant={isAddedToCard ? 'secondary' : 'danger'}
    //       onClick={isAddedToCard ? handleClickRemoveItem : handleClickAddToCart}
    //     >
    //       {isAddedToCard ? 'Hủy Thêm' : 'Thêm vào Giỏ'}
    //     </Button>
    //   </Card.Footer>{' '}
    // </Card>
    <Card className={`product-card mb-4 ${`${isAddedToCard ? 'active' : ''}`}`}>
      <div className="product-image">
        <Link to={`/products/${product.slug}`} className="image">
          <img className="img-1" src={imagesUrl + product.images[0]} />
        </Link>

        <ul className="product-links">
          <li className={''}>
            <button onClick={handleClickBuyNow}>
              <i className="fa fa-shopping-bag"></i>{' '}
              {isAddedToCard ? 'Xem giỏ' : 'Mua ngay'}
            </button>
          </li>
          <li>
            <button
              onClick={
                isAddedToCard ? handleClickRemoveItem : handleClickAddToCart
              }
            >
              <i className="fa fa-shopping-bag"></i>{' '}
              {isAddedToCard ? 'Hủy Thêm' : 'Thêm vào Giỏ'}
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
