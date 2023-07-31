import _ from "lodash";
import React from "react";
import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

//! imp Comps
import AlertDismissibleComponent from "../../../components/Alert/AlertDismissibleComponent";
import BreadcrumbComponent from "../../../components/Breadcrumb/BreadcrumbComponent";
import GoToButtonComponent from "../../../components/Button/GoToButtonComponent";
import ControlledtabsComponent from "../../../components/Form/ControlledTabsComponent";
import ConfirmationModalComponent from "../../../components/Modal/ConfirmationModalComponent";
import PaginationComponent from "../../../components/Pagination/PaginationComponent";
//! imp Comps:tabs
import OrderTabComponent from "../components/OrderTabComponent";
//! imp Hooks
import { useItemsPerPage } from "../../../hooks/itemsPerPage";
import { scrollToTop, useScrollPosition } from "../../../hooks/scroll";
//! imp Actions
import {
  deleteOrder,
  deleteOrders,
  getOrdersByFilters,
  getInvoice,
  clearNotification,
} from "../OrderSlice";
//! imps Constants
import constants from "../../../constants";

const ManageOrderScreen = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  const itemsPerPage = useItemsPerPage(5, 10, 10, 15, 20);
  //! rootState
  const { orders, ordersCount, success, message, error } = useSelector(
    (state) => state.order
  );

  //! localState: Search/Pagination
  const [search, setSearch] = React.useState({
    keyword: "",
    status: "",
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

  //! localState: actionType
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

  //! notice when navigate
  React.useEffect(() => {
    if (success && message) {
      setAlertOpts({
        variant: "success",
        title: "Thông báo",
        message: message,
      });

      handleShowAlert();
    }
    if (error) {
      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message: error,
      });

      handleShowAlert();
    }
    return () => {
      dispatch(clearNotification());
    };
  }, [success, error]);

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
      setLoading(true);
      await dispatch(
        getOrdersByFilters({
          sort: sort,
          order: order,
          page: currentPage,
          perPage: itemsPerPage,
          search: search,
        })
      ).unwrap();
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  async function handleConfirmationSubmit() {
    console.log("handleSubmit");
    try {
      //! single Ids
      if (actionType === constants.order.actionTypes.DELETE_ORDER) {
        /* REMOVE USER ACCOUNT */
        const response = await dispatch(deleteOrder(selectedId)).unwrap();

        setAlertOpts({
          variant: response.success ? "success" : "danger",
          title: `Xóa hóa đơn thành công`,
          message: `Xoá hóa đơn [Người nhận: ${response.data.deletedOrder.name}, số tiền:  ${response.data.deletedOrder.total}đ] thành công!`,
        });

        checkSelectedIds();
} else if (actionType === constants.order.actionTypes.DELETE_ORDERS) {
  /* RESET PASSWORD */
  const response = await dispatch(deleteOrders(selectedIds)).unwrap();

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

  function handleHideAlert() {
    setShowAlert(false);
  }

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideModal() {
    setShowModal(false);
  }

  function handleShowModal() {
    setShowModal(true);
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

  function triggerSelectChange(eventKey) {
    if (eventKey === constants.order.tabs.ALL_ORDERS) {
      setSearch((prevState) => ({ ...prevState, keyword: "", status: "" }));
    } else {
      setSearch((prevState) => ({
        ...prevState,
        keyword: "",
        status: eventKey,
      }));
    }

    //! clear CheckAll
    resetCheckAll();
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

  const tabItems = [
    {
      eventKey: constants.order.tabs.ALL_ORDERS,
      title: "All Orders",
      element: (
        <OrderTabComponent
          orders={orders}
          search={search}
          selectedIds={selectedIds}
          setSearch={setSearch}
          isCheckAll={isCheckAll}
          keyword={keyword}
          setKeyword={setKeyword}
          handleOpenModal={handleOpenModal}
          handleCheckChange={handleCheckChange}
          handleCheckAllChange={handleCheckAllChange}
        />
      ),
    },
    {
      eventKey: constants.order.tabs.PENDING,
      title: "Pending",
      element: (
        <OrderTabComponent
          orders={orders}
          search={search}
          selectedIds={selectedIds}
          setSearch={setSearch}
          isCheckAll={isCheckAll}
          keyword={keyword}
          setKeyword={setKeyword}
          handleOpenModal={handleOpenModal}
          handleCheckChange={handleCheckChange}
          handleCheckAllChange={handleCheckAllChange}
        />
      ),
    },
    {
      eventKey: constants.order.tabs.PAID,
      title: "Paid",
      element: (
        <OrderTabComponent
          orders={orders}
          search={search}
          selectedIds={selectedIds}
          setSearch={setSearch}
          isCheckAll={isCheckAll}
          keyword={keyword}
          setKeyword={setKeyword}
          handleOpenModal={handleOpenModal}
          handleCheckChange={handleCheckChange}
          handleCheckAllChange={handleCheckAllChange}
        />
      ),
    },
    {
      eventKey: constants.order.tabs.COMPLETED,
      title: "Completed",
      element: (
        <OrderTabComponent
          orders={orders}
          search={search}
          selectedIds={selectedIds}
          setSearch={setSearch}
          isCheckAll={isCheckAll}
          keyword={keyword}
          setKeyword={setKeyword}
          handleOpenModal={handleOpenModal}
          handleCheckChange={handleCheckChange}
          handleCheckAllChange={handleCheckAllChange}
        />
      ),
    },
    {
      eventKey: constants.order.tabs.CANCELED,
      title: "Canceled",
      element: (
        <OrderTabComponent
          keyword={keyword}
          search={search}
          setSearch={setSearch}
          orders={orders}
          isCheckAll={isCheckAll}
          selectedIds={selectedIds}
          setKeyword={setKeyword}
          handleOpenModal={handleOpenModal}
          handleCheckChange={handleCheckChange}
          handleCheckAllChange={handleCheckAllChange}
        />
      ),
    },
  ];

  const breadcrumbItems = [
    { key: "breadcrumb-item-0", label: "Home", path: "/" },
    { key: "breadcrumb-item-1", label: "Dashboard", path: "/admin" },
    {
      key: "breadcrumb-item-2",
      label: "Quản lý Mua hàng",
      path: "/admin/orders",
      active: true,
    },
  ];

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
        <ControlledtabsComponent
          tabItems={tabItems}
          triggerSelectChange={triggerSelectChange}
        />
      </Row>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          currentPage={currentPage}
          itemsCount={ordersCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          alwaysShown={false}
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

export default ManageOrderScreen;
