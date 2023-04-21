import _ from 'lodash';
import React from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//! imp Utils
import { parseIntlNumber } from '../../../utils/parse';
//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import CartItemComponent from '../components/CartItemComponent';

import {
  decrementQuantity,
  emptyCart,
  incrementQuantity,
  removeItem,
} from '../CartSlice';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //! rootState
  const { user, token } = useSelector((state) => state.auth);

  const isAuthenticated =
    token && user.roles?.map((role) => role.name).includes('user');

  const cart = useSelector((state) => state.cart);
  //! cart
  const total = cart.cartItems?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const vatCost = total * 0.1;

  //! localState: alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  //! localState Modal
  const [showModal, setShowModal] = React.useState(false);
  const [modalOptions, setModalOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
    nameButton: null,
  });

  //! localState: selected
  const [selectedId, setSelectedId] = React.useState([]);
  const [actionType, setActionType] = React.useState('');

  // const { productId } = useParams();

  // const [searchParams, setSearchParams] = useSearchParams();
  // const qty = searchParams.get('qty');

  // const { cartItems, loading, error } = useSelector((state) => state.cart); //! by BT after qty, above Effect

  // React.useEffect(() => {
  //   if (productId) {
  //     // dispatch(addToCart({ productId, qty }));
  //   }
  // }, [dispatch, productId, qty]); //! by BT

  function handleClickIncrementQuantity(entity) {
    dispatch(incrementQuantity(entity.product));
  }

  function handleClickDecrementQuantity(entity) {
    dispatch(decrementQuantity(entity.product));
  }

  function handleClickDeleteCartItem(entity) {
    setSelectedId(entity.product);
    setActionType('DELETE_CART_ITEM');
    //! Set Modal Optons
    setModalOptions({
      variant: 'warning',
      title: 'Xác nhận loại bỏ sản phẩm',
      message: `Bạn có muốn loại bỏ [${entity.name}] ra khoải Giỏ hàng không?`,
      nameButton: 'Xác nhận Loại bỏ',
    });

    handleShowModal();
  }

  function handleClickEmptyCart() {
    if (_.isEmpty(cart.cartItems)) return;

    setSelectedId('');
    setActionType('EMPTY_CART');
    //! Set Modal Optons
    setModalOptions({
      variant: 'warning',
      title: 'Xác nhận làm trống giỏ hàng',
      message: `Bạn có muốn làm trống Giỏ hàng không?`,
      nameButton: 'Xác nhận Làm trống',
    });

    handleShowModal();
  }

  function handleHideModal() {
    setShowModal(false);
  }

  function handleShowModal() {
    setShowModal(true);
  }

  async function handleModalSubmit() {
    try {
      switch (actionType) {
        case 'DELETE_CART_ITEM':
          dispatch(removeItem(selectedId));
          break;

        case 'EMPTY_CART':
          dispatch(emptyCart());
          break;

        default:
          break;
      }

      handleHideModal();
    } catch (error) {
      handleHideModal();
      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });

      setShowAlert(true);
      toast.error(error.response?.message);
    }
  }

  function handleClickGotoCheckout() {
    if (isAuthenticated) {
      navigate(`/users/${user._id}/checkout`, { replace: false });
    } else {
      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message: 'Đăng nhập trước khi Thanh toán'
      });
      handleShowAlert();
    }
  }

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  // <section className="h-100 h-custom" style="background-color: #d2c9ff;">
  return (
    <Container>
      <AlertDismissibleComponent
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        show={showAlert}
        setShow={setShowAlert}
        alwaysShown={true}
      />

      <div className="row">
        <div className="col-12 col-xl-9 p-5 bg-white rounded shadow-sm">
          {/* <!-- Shopping cart table : Table Heading --> */}
          <div className="table-responsive">
            <Table className="table">
              <thead>
                <tr>
                  <th scope="col" className="border-0 bg-light text-center">
                    <div className="p-2 px-3 text-uppercase">Tên sản phẩm</div>
                  </th>
                  <th scope="col" className="border-0 bg-light text-center">
                    <div className="py-2 text-uppercase">Giá</div>
                  </th>
                  <th scope="col" className="border-0 bg-light text-center">
                    <div className="py-2 text-uppercase">Số lượng</div>
                  </th>
                  <th scope="col" className="border-0 bg-light text-center">
                    <div className="py-2 text-uppercase">Thành tiền</div>
                  </th>
                  <th scope="col" className="border-0 bg-light text-center">
                    <div className="py-2 text-uppercase">Xóa</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <!-- Shopping cart table : Table Body --> */}
                {/* <!-- render cart item --> */}
                {cart.cartItems?.map((item) => (
                  <CartItemComponent
                    key={item.product}
                    entity={item}
                    handleClickIncrementQuantity={handleClickIncrementQuantity}
                    handleClickDecrementQuantity={handleClickDecrementQuantity}
                    handleClickDeleteCartItem={handleClickDeleteCartItem}
                  />
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end">
              <Button
                className="btn-empty-cart"
                variant="danger"
                onClick={handleClickEmptyCart}
              >
                Xóa tất cả
              </Button>
            </div>
          </div>
          {/* <!-- End --> */}
        </div>
        {/* <!-- Order Summary --> */}
        <div className="col-12 col-xl-3 p-2 bg-white rounded shadow-sm mb-5">
          <div className="bg-light rounded-pill px-4 py-3 text-uppercase font-weight-bold">
            Tổng thành tiền:
          </div>
          <div className="p-4">
            <p className="font-italic mb-4">
              Vận chuyển và chi phí bổ sung được tính toán dựa trên giá trị gia
              tăng.
            </p>
            <ul className="list-unstyled mb-4">
              <li className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Tổng Thành tiền</strong>
                <strong>{parseIntlNumber(total)}</strong>
              </li>
              {/* <li className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">VAT</strong>
                <strong>{parseIntlNumber(vatCost)}</strong>
              </li> 
              <li className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Total</strong>
                <h5 className="font-weight-bold">$400.00</h5>
              </li>*/}
            </ul>
            <button
              className="btn btn-dark rounded-pill py-2 btn-block"
              onClick={handleClickGotoCheckout}
            >
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModalComponent
        showModal={showModal}
        handleHideModal={handleHideModal}
        variant={modalOptions.variant}
        title={modalOptions.title}
        message={modalOptions.message}
        handleSubmit={handleModalSubmit}
        nameButton={modalOptions.nameButton}
      />
      {/* <GoToButtonComponent visible={scrollPosition > 300} /> */}
    </Container>
  );
};

export default CartScreen;
