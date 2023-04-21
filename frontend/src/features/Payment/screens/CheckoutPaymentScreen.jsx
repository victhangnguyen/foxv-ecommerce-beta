import React from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import CheckoutPaymentFormComponent from '../components/CheckoutPaymentFormComponent';

//! imp APIs
import API from '../../../API';

//! imp Actions
import { createOrder } from '../../Order/OrderSlice';

const CheckoutPaymentScreen = ({ entity }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const order = useSelector((state) => state.order);

  //! localState: alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  const total = cart.cartItems?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  React.useLayoutEffect(() => {
    //! check Expired Order 15 minunes
    if (order.newOrder) {
      let redirect = `/order/${order.newOrder._id}`;
      if (order.newOrder.paymentUrl) {
        redirect = order.newOrder.paymentUrl;
      }
      window.open(redirect, '_self');
    } else {
      //! error system, try again
    }
  }, [order.newOrder]);

  const initialValues = {
    bankCode: '',
  };

  async function handleClickCheckout() {
    try {
      //! check emptyCart
      if (_.isEmpty(cart.cartItems)) {
        //! show Alert Error
        setAlertOptions({
          variant: 'warning',
          title: 'Giỏ hàng chưa có sản phẩm',
          message:
            'Vui lòng chọn sản phẩm trước khi thực hiện TIẾN TRÌNH THANH TOÁN',
        });

        handleShowAlert();
        return;
      }

      // if (!isAuthenticated) {
      //   //! show Alert Error
      //   setAlertOptions({
      //     variant: 'danger',
      //     title: 'Truy cập không hợp lệ',
      //     message:
      //       'Vui lòng đăng nhập trước khi thực hiện TIẾN TRÌNH THANH TOÁN',
      //   });

      //   handleShowAlert();
      //   return;
      // }

      // navigate('/login?redirect=shipping');
      //! process checkout the Order
      //! save the Cart and get (create) Order
      const response = await dispatch(
        createOrder(cart.cartItems, total)
      ).unwrap();

      const order = response?.data?.order;
      if (!order) {
        throw new Error('Có lỗi xảy ra, xin vui lòng thử lại!');
      }

      return navigate(`/orders/${order._id}`);
    } catch (error) {
      // handleHideModal();
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

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  async function handleCheckoutOrderSubmit(data, e, methods) {
    const { name, address, bankCode } = data;
    dispatch(
      createOrder({
        name,
        address,
        bankCode,
        items: cart.cartItems,
        orderPayAmount: total,
      })
    );
  }

  return (
    <div className="container d-flex">
      <AlertDismissibleComponent
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        show={showAlert}
        setShow={setShowAlert}
        alwaysShown={true}
      />

      <div className="row">
        <div className="col-md-5 col-lg-5 col-xl-4">
          <div className="p-3">
            <span className="fw-bold">Chi tiết đơn hàng</span>
            {cart.cartItems?.map((item) => (
              <div
                key={item.product}
                className="d-flex justify-content-between mt-2"
              >
                <span>
                  {item.name} ({item.quantity} cái)
                </span>{' '}
                <span>{item.quantity * item.price}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mt-2">
              <span>Tổng cộng</span>{' '}
              <span className="text-success">{total}</span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-xl-7 offset-md-1">
          <CheckoutPaymentFormComponent
            initialValues={initialValues}
            onSubmit={handleCheckoutOrderSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentScreen;

/*
  https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?
  vnp_Amount=1806000
  vnp_Command=pay
  vnp_CreateDate=20210801153333
  vnp_CurrCode=VND
  vnp_IpAddr=127.0.0.1
  vnp_Locale=vn
  vnp_OrderInfo=Thanh+toan+don+hang+%3A5
  vnp_OrderType=other
  vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl
  vnp_TmnCode=DEMOV210
  vnp_TxnRef=5
  vnp_Version=2.1.0
  vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42
*/
