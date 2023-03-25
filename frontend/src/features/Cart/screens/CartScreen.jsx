import React from 'react';
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Table,
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from 'react-bootstrap';
//! imp Actions
import { decrementQuantity, incrementQuantity, removeItem } from '../CartSlice';

//! imp Comps
// import MessageCommponent from '../../../components/MessageCommponent.jsx';
import TrashIcon from '../../../components/Icon/TrashIcon';

const REACT_APP_SERVER = 'http://127.0.0.1';
const REACT_APP_PORT = 5000;

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;

  //! reduxState
  const cart = useSelector((state) => ({ ...state.cart }));

  console.log('__Debugger__CartScreen\n__***__cart: ', cart, '\n');

  // const { productId } = useParams();
  // console.log(
  //   `%c __Debugger__CartScreen: ${productId}`,
  //   'color: green; font-weight: bold'
  // );

  // const [searchParams, setSearchParams] = useSearchParams();
  // const qty = searchParams.get('qty');
  // console.log(
  //   `%c __Debugger__CartScreen: ${qty}`,
  //   'color: green; font-weight: bold'
  // );

  // const { cartItems, loading, error } = useSelector((state) => state.cart); //! by BT after qty, above Effect

  // console.log(
  //   '__Debugger__CartScreen__cartItems: ',
  //   cartItems,
  //   ' - loading: ',
  //   loading,
  //   ' - error: ',
  //   error
  // );

  // React.useEffect(() => {
  //   if (productId) {
  //     // dispatch(addToCart({ productId, qty }));
  //   }
  // }, [dispatch, productId, qty]); //! by BT

  // const onChangeHandler = (productId, qty) => {
  //   // console.log(
  //   //   `%c __Debugger__CartScreen__onChangeHandler__productId: ${productId} - qty: ${qty}`,
  //   //   'color: brown; font-weight: bold'
  //   // );
  //   dispatch(addToCart({ productId, qty }));
  // };

  // const removeFromCartHandler = (productId) => {
  //   dispatch(removeFromCart(productId));
  //   // console.log(
  //   //   `%c __Debugger__CartScreen__removeFromCartHandler__productId: ${productId}`,
  //   //   'color: red; font-weight: bold'
  //   // );
  // };

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
    console.log(
      `%c __Debugger__CartScreen__checkoutHandler`,
      'color: red; font-weight: bold'
    );
  };

  function handleClickDeleteCartItem(productId) {
    dispatch(removeItem(productId));
  }

  // <section className="h-100 h-custom" style="background-color: #d2c9ff;">
  return (
    <Container className="py-5 h-100">
      <div className="row">
        <div className="col-12 col-md-9 p-5 bg-white rounded shadow-sm">
          {/* <!-- Shopping cart table : Table Heading --> */}
          <div className="table-responsive">
            <Table className="table">
              <thead>
                <tr>
                  <th scope="col" className="border-0 bg-light">
                    <div className="p-2 px-3 text-uppercase">Tên sản phẩm</div>
                  </th>
                  <th scope="col" className="border-0 bg-light">
                    <div className="py-2 text-uppercase">Giá</div>
                  </th>
                  <th scope="col" className="border-0 bg-light">
                    <div className="py-2 text-uppercase">Số lượng</div>
                  </th>
                  <th scope="col" className="border-0 bg-light">
                    <div className="py-2 text-uppercase">Xóa</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <!-- Shopping cart table : Table Body --> */}
                {/* <!-- render cart item --> */}
                {cart.cartItems.map((item) => (
                  <tr key={item._id}>
                    <th scope="row">
                      <div className="p-2">
                        <Link to={`/products/${item.slug}`}>
                          <img
                            src={imagesUrl + item.image}
                            alt=""
                            width="70"
                            className="img-fluid rounded shadow-sm"
                          />{' '}
                        </Link>
                        <div className="ml-3 d-inline-block align-middle">
                          <h5 className="mb-0">
                            <Link to={`/products/${item.slug}`}>
                              {item.name}
                            </Link>
                          </h5>
                          <span className="text-muted font-weight-normal font-italic">
                            {item.category.name}
                          </span>
                        </div>
                      </div>
                    </th>
                    <td className="align-middle">
                      <strong>{item.price}</strong>
                    </td>
                    <td className="align-middle">
                      <strong>{item.quantity}</strong>
                    </td>
                    <td className="align-middle">
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => handleClickDeleteCartItem(item._id)}
                      >
                        <TrashIcon size={'1.5rem'} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* <!-- End --> */}
        </div>
        {/* <!-- Order Summary --> */}
        <div className="col-12 col-md-3 p-2 bg-white rounded shadow-sm mb-5">
          <div className="bg-light rounded-pill px-4 py-3 text-uppercase font-weight-bold">
            Tổng thành tiền{' '}
          </div>
          <div className="p-4">
            <p className="font-italic mb-4">
              Shipping and additional costs are calculated based on values you
              have entered.
            </p>
            <ul className="list-unstyled mb-4">
              <li className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Order Subtotal </strong>
                <strong>$390.00</strong>
              </li>
              <li className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Shipping and handling</strong>
                <strong>$10.00</strong>
              </li>
              <li className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Tax</strong>
                <strong>$0.00</strong>
              </li>
              <li className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Total</strong>
                <h5 className="font-weight-bold">$400.00</h5>
              </li>
            </ul>
            <a href="#" className="btn btn-dark rounded-pill py-2 btn-block">
              Procceed to checkout
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CartScreen;
