import _ from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
//! imp Utils
import { parseIntlNumber } from '../../../utils/parse';

//! imp Constants
import constants from '../../../constants';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import OrderFormComponent from '../components/OrderFormComponent';

//! imp Actions
import { emptyCart } from '../../Cart/CartSlice';
import { emptyNewOrder, getOrderById } from '../OrderSlice';

//! imp API
import API from '../../../API';

const AddEditOrderScreen = ({ entity }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  //! rootState
  const order = useSelector((state) => state.order);

  //! localState: alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  React.useEffect(() => {
    loadOrderById(orderId);
  }, [orderId]);

  //! handle newOrder (createdOrder)
  React.useLayoutEffect(() => {
    if (_.isEmpty(order.newOrder)) return;

    async function hanldeNewOrder() {
      try {
        //! update newOrder
        const response = await API.getOrderById(order.newOrder?._id);
        switch (response.data.order.status) {
          case constants.order.status.CANCELED:
            // emptyNewOrder
            dispatch(emptyNewOrder());
            break;
          case constants.order.status.PAID:
            //! emptyCart
            dispatch(emptyCart());
            // emptyNewOrder
            dispatch(emptyNewOrder());
            break;

          default:
            break;
        }
      } catch (error) {
        console.log('Error: ', error);
      }
    }

    hanldeNewOrder();
  }, [order.newOrder?.status]);

  async function loadOrderById(orderId) {
    try {
      await dispatch(getOrderById(orderId));
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  const initialValues = {
    name: order.order?.name,
    address: order.order?.address,
    orderId: order.order?._id,
    orderDate: order.order?.orderDate,
    status: order.order?.status,
    transactionNo: order.order?.transactionNo,
    bankTranNo: order.order?.bankTranNo,
  };

  function handleCheckoutOrderSubmit() {
    //! localFunction
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
            {order.order?.items?.map((item) => (
              <div
                key={item.product}
                className="d-flex justify-content-between mt-2"
              >
                <span>
                  {item.name} ({item.quantity} cái)
                </span>
                <span>{parseIntlNumber(item.quantity * item.price)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mt-2">
              <span>Tổng cộng</span>
              <span className="text-success">
                {parseIntlNumber(order.order?.total)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-xl-7 offset-md-1">
          <OrderFormComponent initialValues={initialValues} />
        </div>
      </div>
    </div>
  );
};

export default AddEditOrderScreen;

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
