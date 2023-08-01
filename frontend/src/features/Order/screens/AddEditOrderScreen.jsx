import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
//! imp Utils
import { parseIntlNumber } from "../../../utils/parse";
//! imp Constants
import constants from "../../../constants";
//! imp Comps
import AlertDismissibleComponent from "../../../components/Alert/AlertDismissibleComponent";
import OrderFormComponent from "../components/OrderFormComponent";
//! imp Actions
import { emptyCart } from "../../Cart/CartSlice";
import {
  emptyNewOrder,
  getOrderById,
  updateOrder,
  clearNotification,
} from "../OrderSlice";
//! imp API
import API from "../../../API";

const AddEditOrderScreen = ({ entity }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  //! rootState
  const auth = useSelector((state) => state.auth);
  const isAdminController = auth.user?.roles
    ?.map((role) => role.name)
    .includes("admin");

  const { order, newOrder, loading, success, message, error } = useSelector(
    (state) => state.order
  );

  //! localState: alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: "",
    title: "",
    message: "",
  });

  React.useEffect(() => {
    loadOrderById(orderId);
  }, [orderId]);

  React.useEffect(() => {
    if (success && message) {
      setAlertOpts({
        variant: "success",
        title: "Thông báo",
        message: message,
      });
    }
    if (success === false && error) {
      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message: error,
      });
    }
    handleShowAlert();
    return () => {
      dispatch(clearNotification());
    };
  }, [success, message, error]);

  //! automatically reset the Cart or NewOrder whenever the Customer paid or cancelled.
  React.useLayoutEffect(() => {
    if (_.isEmpty(newOrder)) return;

    async function hanldeNewOrder() {
      try {
        //! update newOrder
        const response = await API.order.getOrderById(newOrder?._id);
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
            //! resetForm
            // dispatch(emptyCart());
            // dispatch(emptyNewOrder());
            break;
        }
      } catch (error) {
        setAlertOpts({
          variant: "danger",
          title: "Lỗi hệ thống",
          message:
            error.response?.data?.message ||
            error.response?.message ||
            error.message ||
            error,
        });

        handleShowAlert();
      }
    }

    hanldeNewOrder();
  }, [newOrder?.status]);

  async function loadOrderById(orderId) {
    try {
      const response = await dispatch(getOrderById(orderId));
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function handleUpdateSubmit(data, e, methods) {
    const { orderDate, orderId, ...otherData } = initialValues;
    const comparedInitialValues = { ...otherData };

    const isEqualData = _.isEqual(comparedInitialValues, data);

    if (isEqualData) {
      return toast.error("Chưa có thông tin nào thay đổi.");
    }

    try {
      const response = await dispatch(
        updateOrder({ orderId, orderData: data })
      ).unwrap();
      if (response.success) {
        navigate("/admin/orders", { replace: true });
      }
    } catch (error) {
      //! Error Handling 422
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors?.length) return;
        errors.forEach((error) => {
          methods.setError(error.param, {
            type: "server",
            message: error.msg,
          });
        });

        return;
      }

      //! Error Handling Other
      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });

      handleShowAlert();
      toast.error(error.response?.message || error.massage);
    }
  }

  function handleClickCancel() {
    navigate("/admin/orders", { replace: true });
  }

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  const initialValues = {
    orderId: order?._id,
    userId: order?.user,
    name: order?.name,
    address: order?.address,
    orderDate: order?.orderDate,
    status: order?.status,
    transactionNo: order?.transactionNo,
    bankTranNo: order?.bankTranNo,
  };

  return (
    <div className="container">
      <AlertDismissibleComponent
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        show={showAlert}
        handleHideAlert={handleHideAlert}
        alwaysShown={true}
      />

      <div className="row">
        <div className="col-md-5 col-lg-5 col-xl-4">
          <div className="p-3">
            <span className="fw-bold">Chi tiết đơn hàng</span>
            {order?.items?.map((item) => (
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
                {parseIntlNumber(order?.total)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-xl-7 offset-md-1">
          <OrderFormComponent
            isAdminController={isAdminController}
            order={order}
            orderId={orderId}
            initialValues={initialValues}
            onSubmit={handleUpdateSubmit}
            handleClickCancel={handleClickCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditOrderScreen;
