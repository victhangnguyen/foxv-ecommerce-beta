import React from "react";
import _ from "lodash";
import useIsMounted from "../../../hooks/useIsMounted";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//! imp Comps
import AlertDismissibleComponent from "../../../components/Alert/AlertDismissibleComponent";
import CheckoutPaymentFormComponent from "../components/CheckoutPaymentFormComponent";

//! imp Actions
import { checkoutOrder, clearNotification } from "../../Order/OrderSlice";

const CheckoutPaymentScreen = ({ entity }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMounted = useIsMounted();

  const cart = useSelector((state) => state.cart);
  const order = useSelector((state) => state.order);

  //! localState: alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: "",
    title: "",
    message: "",
  });

  const total = cart.cartItems?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  React.useEffect(() => {
    if (order.success && order.message) {
      setAlertOpts({
        variant: "success",
        title: "Thông báo",
        message: order.message,
      });
    }
    if (order.success === false && order.error) {
      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message: order.error,
      });
    }
    handleShowAlert();
    return () => {
      dispatch(clearNotification());
    };
  }, [order.success, order.message, order.error]);

  //! Handling Timeout 

  React.useLayoutEffect(() => {
    // let redirect = `/order/${order.newOrder?._id}`;
    async function handleCheckoutOrder() {
      try {
        //! check Expired Order 15 minunes => delete newOrder

        if (order.newOrder?.paymentUrl) {
          let redirect = order.newOrder.paymentUrl;

          console.log("Layout Effect -> order.newOrder?.paymentUrl");
          const cartItems = cart.cartItems.map((item) => {
            return {
              category: item.category?._id || item.category,
              product: item.product,
              quantity: item.quantity,
              slug: item.slug,
              name: item.name,
              image: item.image,
              price: item.price,
            };
          });
          const newOrderItems = order.newOrder?.items;
          //! check if cartItems is changed => update paymentUrl,
          //! else if cartItems dont change => redirect paymentUrl
          if (isMounted && _.isEqual(newOrderItems, cartItems)) {
            window.open(redirect, "_self");
          } else {
            // console.log('asdjflasdlflsajflsldfjljsladfldsjkf')
            //! MODE: items are changed
            //! update current Order
            const orderId = order.newOrder?._id || null;
            const response = await dispatch(
              checkoutOrder({
                orderId,
                name: order.newOrder.name,
                address: order.newOrder.address,
                bankCode: order.newOrder.bankCode,
                items: cart.cartItems,
                orderPayAmount: total,
              })
            ).unwrap();
            
            // window.open(redirect, "_self");
          }
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    handleCheckoutOrder();
  }, [order.newOrder?._id, order.newOrder?.items, isMounted]);
  // }, []);

  const initialValues = {
    bankCode: "",
  };

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  function handleCheckoutOrderSubmit(data, e, methods) {
    const { name, address, bankCode } = data;
    const orderId = order.newOrder?._id || null;
    dispatch(
      checkoutOrder({
        orderId,
        name,
        address,
        bankCode,
        items: cart.cartItems,
        orderPayAmount: total,
      })
    );
  }

  return (
    <>
      <div className="row">
        <AlertDismissibleComponent
          variant={alertOpts.variant}
          title={alertOpts.title}
          message={alertOpts.message}
          show={showAlert}
          handleHideAlert={handleHideAlert}
          alwaysShown={true}
        />
      </div>
      <div className="container d-flex">
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
                  </span>{" "}
                  <span>{item.quantity * item.price}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mt-2">
                <span>Tổng cộng</span>{" "}
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
    </>
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
