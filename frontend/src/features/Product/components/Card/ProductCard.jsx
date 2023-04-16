import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
//! imp Actions
import { addToCart, removeItem } from '../../../Cart/CartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  //! reduxState
  const cart = useSelector((state) => state.cart);

  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;

  const isAddedToCard = cart.cartItems
    ?.map((item) => item.product)
    .includes(product._id);

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

  return (
    <Card as="article" className="my-3 p-3 rounded card-product">
      <Link to={`/products/${product.slug}`}>
        <Card.Img src={imagesUrl + product.images[0]} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/products/${product.slug}`}>
          <Card.Title as={'div'}>{product.name}</Card.Title>
        </Link>
        <Card.Text as={'div'}>
          {/* <RatingComponent
          value={product.rating}
          text={`${product.numReviews} reviews `}
        /> */}
        </Card.Text>
        <Card.Text as={'h5'}>{product.price}</Card.Text>
      </Card.Body>
      <Card.Footer as={'div'} className="d-flex">
        <Link to={``}>
          <Button size="sm" variant={'primary'}>
            Mua ngay
          </Button>
        </Link>
        <Button
          size="sm"
          variant={isAddedToCard ? 'secondary' : 'danger'}
          onClick={isAddedToCard ? handleClickRemoveItem : handleClickAddToCart}
        >
          {isAddedToCard ? 'Hủy Thêm' : 'Thêm vào Giỏ'}
        </Button>
      </Card.Footer>{' '}
    </Card>
  );
};

export default ProductCard;
