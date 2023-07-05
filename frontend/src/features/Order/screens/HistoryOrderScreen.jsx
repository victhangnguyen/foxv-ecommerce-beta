import React from "react";
import _ from "lodash";
//! imp Comps
import { Row, Col } from "react-bootstrap";
import BreadcrumbComponent from "../../../components/Breadcrumb/BreadcrumbComponent";
import AlertDismissibleComponent from "../../../components/Alert/AlertDismissibleComponent";
import ConfirmationModalComponent from "../../../components/Modal/ConfirmationModalComponent";
import PaginationComponent from "../../../components/Pagination/PaginationComponent";
import GoToButtonComponent from "../../../components/Button/GoToButtonComponent";
import ToolbarComponent from "../components/ToolbarComponent";
import OrderItemComponent from "../components/OrderItemComponent";
//! imp Hooks
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useItemsPerPage } from "../../../hooks/itemsPerPage";
import { scrollToTop, useScrollPosition } from "../../../hooks/scroll";
//! imp Actions
import {
  deleteOrderByUserId,
  deleteOrdersByUserId,
  getOrdersByFilters,
  getInvoice,
  clearNotification,
} from "../OrderSlice";
//! imp Constants
import constants from "../../../constants";

const HistoryOrderScreen = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  const itemsPerPage = useItemsPerPage(5, 10, 10, 15, 20);
  const { userId } = useParams();
  const { orders, ordersCount, success, message, error } = useSelector(
    (state) => state.order
  );

  //! localState: Search/Pagination
  const [search, setSearch] = React.useState({
    keyword: "",
    status: "",
    userId: null,
  }); //! search orderId, status, name, address...

  const [keyword, setKeyword] = React.useState("");

  //! localState: init
  const [loading, setLoading] = React.useState();
  const [sort, setSort] = React.useState("updatedAt");
  const [order, setOrder] = React.useState(-1);
  const [currentPage, setCurrentPage] = React.useState(1);

  //! localState: Select Ids
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState("");

  //! localState: actionTypek
  const [actionType, setActionType] = React.useState("");

  //! localState: Modal
  const [showModal, setShowModal] = React.useState(false);
  const [modalOpts, setModalOpts] = React.useState({
    variant: "",
    title: "",
    message: "",
  });

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: "success",
    title: "",
    message: "",
    button: "",
  });

  // React.useEffect(() => {
  //   setSearch((prevState) => ({ ...prevState, userId: userId }));
  // }, []);

  React.useEffect(() => {
    const load = async () => {
      try {
        await loadOrders();
      } catch (error) {
        handleShowAlert();

        setAlertOpts({
          variant: "danger",
          title: "Lỗi hệ thống",
          message:
            error.response?.data?.message ||
            error.response?.message ||
            error.message,
        });
      }
    };

    load();
  }, [sort, order, currentPage, itemsPerPage, search]);

  //! un-check All if selectedIds equal to 0
  React.useEffect(() => {
    if (selectedIds.length !== 0) return;

    if (isCheckAll) {
      handleCheckAllChange();
    }
  }, [selectedIds]);

  async function loadOrders() {
    try {
      await dispatch(
        getOrdersByFilters({
          sort: sort,
          order: order,
          page: currentPage,
          perPage: itemsPerPage,
          search: {
            keyword: search.keyword,
            status: search.status,
            userId: userId,
          },
        })
      ).unwrap();
    } catch (error) {
      throw error;
    }
  }

  async function handleOpenModal(actionType, ids) {
    //! clear Form
    handleHideAlert();

    setActionType(actionType);

    let selectedOrders;
    if (_.isArray(ids)) {
      //! multiple Ids
      setSelectedIds(ids);
      selectedOrders = ids?.map((id) =>
        orders.find((order) => order._id === id)
      );
    } else {
      //! single Id
      //! bổ sung: fix lại multiple selectedIds sau khi xóa id single Ids
      setSelectedId(ids);
      selectedOrders = [orders.find((order) => order._id === ids)];
    }

    switch (actionType) {
      /* DELETE ONE ORDER */
      case constants.order.actionTypes.DELETE_ORDER:
        setModalOpts({
          variant: "warning",
          title: `Xác nhận xóa hóa đơn`,
          message: `Bạn có muốn xóa hóa đơn này không? [Người nhận: ${selectedOrders[0]?.name}, Tình trạng: ${selectedOrders[0]?.status}]`,
          nameButton: "Xác nhận xóa",
        });

        break;
      /* DELETE_ORDERS */
      case constants.order.actionTypes.DELETE_ORDERS:
        setModalOpts({
          variant: "warning",
          title: `Xác nhận xóa nhiều hóa đơn`,
          message: `Bạn có muốn xóa những hóa đơn này không? [Người nhận: ${selectedOrders[0]?.name}, Tình trạng: ${selectedOrders[0]?.status}, ...]`,
          nameButton: "Xác nhận xóa nhiều",
        });

        break;

      case constants.order.actionTypes.DOWNLOAD_INVOICE:
        try {
          const response = await dispatch(getInvoice(ids)).unwrap();
          window.open(response.data.invoiceUrl);
        } catch (error) {
          console.log("Error: ", error);
        }

        return;

      default:
        setAlertOpts({
          variant: "danger",
          title: `Hệ thống đang phát triển chức năng`,
          message: `Chức năng này đang được phát triển hoặc nâng cấp. Xin vui lòng xử dụng chức năng này sau!`,
        });

        handleShowAlert();
        return;
    }

    //! Show Confirmation Modal
    handleShowModal();
  }

  function handleCheckChange(e) {
    const { id, checked } = e.target;

    if (!checked) {
      setSelectedIds((prevState) =>
        prevState.filter((orderId) => orderId !== id)
      );
    } else {
      setSelectedIds((prevState) => [...prevState, id]);
    }
    //! reset isCheckAll
    // if (selectedIds.length === 0 && isCheckAll) {
    //   setIsCheckAll(false);
    // }
  }

  function handleCheckAllChange() {
    setIsCheckAll(!isCheckAll);
    if (!isCheckAll) {
      setSelectedIds(orders?.map((order) => order._id));
    } else {
      setSelectedIds([]); //! unticked
    }
  }

  async function handleConfirmationSubmit() {
    console.log("handleSubmit");
    try {
      //! single Ids
      if (actionType === constants.order.actionTypes.DELETE_ORDER) {
        /* REMOVE USER ACCOUNT */
        const response = await dispatch(
          deleteOrderByUserId(selectedId)
        ).unwrap();
        setAlertOpts({
          variant: response.success ? "success" : "danger",
          title: `Xóa hóa đơn thành công`,
          message: `Xoá hóa đơn [Người nhận: ${response.data.deletedOrder.name}, số tiền:  ${response.data.deletedOrder.total}đ] thành công!`,
        });

        checkSelectedIds();
      } else if (actionType === constants.order.actionTypes.DELETE_ORDERS) {
        /* RESET PASSWORD */
        const response = await dispatch(
          deleteOrdersByUserId(selectedIds)
        ).unwrap();

        setAlertOpts({
          variant: response.success ? "success" : "danger",
          title: `Xóa nhiều hóa đơn thành công`,
          message: `Xoá nhiều hóa đơn [Người nhận: ${response.data.deletedOrders[0].name}, số tiền:  ${response.data.deletedOrders[0].total}đ, ...] thành công!`,
        });

        resetCheckAll();
      }

      handleHideModal();
      handleShowAlert();
      //! re-load
      loadOrders();
      // checkSelectedIds();

      //! gotoTop
      scrollToTop();
    } catch (error) {
      handleHideModal();
      handleShowAlert();

      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });
    }
  }

  function handleCheckAllChange() {
    setIsCheckAll(!isCheckAll);
    if (!isCheckAll) {
      setSelectedIds(orders?.map((order) => order._id));
    } else {
      setSelectedIds([]); //! unticked
    }
  }

  function resetCheckAll() {
    //! reset CheckAll
    setSelectedId("");
    setSelectedIds([]);
    setIsCheckAll(false);
  }

  function checkSelectedIds() {
    if (selectedIds.length === 0) return;
    setSelectedIds((prevState) => prevState.filter((id) => id !== selectedId));
  }

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  function handleShowModal() {
    setShowModal(true);
  }

  function handleHideModal() {
    setShowModal(false);
  }

  const breadcrumbItems = [
    { key: "breadcrumb-item-0", label: "Home", path: "/" },
    {
      key: "breadcrumb-item-1",
      label: "Lịch sử mua hàng",
      path: `/users/${userId}/history-orders`,
      active: true,
    },
  ];

  const renderOrderItems = orders?.map((order) => {
    return (
      <OrderItemComponent
        key={order._id}
        order={order}
        selectedIds={selectedIds}
        handleOpenModal={handleOpenModal}
        handleCheckChange={handleCheckChange}
      />
    );
  });

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        alwaysShown={true}
      />
      <Row>
        {
          //! Container that in main (App-index.js)
        }
        <div className="d-flex">
          <ToolbarComponent
            selectedIds={selectedIds}
            isCheckAll={isCheckAll}
            keyword={keyword}
            setKeyword={setKeyword}
            setSearch={setSearch}
            handleCheckAllChange={handleCheckAllChange}
            handleOpenModal={handleOpenModal}
          />
        </div>

        <div className="table-responsive">
          <table className="table__orders">
            <thead>
              <tr>
                <th scope="col" className="col py-1 px-3"></th>
                <th scope="col" className="col-3 py-1 px-3 text-center">
                  Id
                </th>
                <th scope="col" className="col-3 py-1 px-3 text-center">
                  Name
                </th>
                <th scope="col" className="col-4 py-1 px-3 text-center">
                  Address
                </th>
                <th scope="col" className="col-2 py-1 px-3 text-center">
                  Status
                </th>
                <th scope="col" className="col"></th>
              </tr>
            </thead>
            <tbody>{renderOrderItems}</tbody>
          </table>
        </div>
      </Row>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          currentPage={currentPage}
          itemsCount={ordersCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          alwaysShown={true}
        />
      </div>
      <ConfirmationModalComponent
        showModal={showModal}
        variant={modalOpts.variant}
        title={modalOpts.title}
        nameButton={modalOpts.nameButton}
        message={modalOpts.message}
        handleHideModal={handleHideModal}
        handleSubmit={handleConfirmationSubmit}
      />
      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default HistoryOrderScreen;
