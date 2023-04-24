import React from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';
import ControlledtabsComponent from '../../../components/Form/ControlledTabsComponent';
import ToolbarComponent from '../components/ToolbarComponent';
//! imp Comps:tabs
import OrderTabComponent from '../components/OrderTabComponent';
//! imp Hooks
import { useItemsPerPage } from '../../../hooks/itemsPerPage';
import { useScrollPosition, scrollToTop } from '../../../hooks/scroll';
//! imps Actions
import { getOrdersByFilters, deleteOrder, deleteOrders } from '../OrderSlice';
//! imps Constants
import constants from '../../../constants';
//! imp APIs
import API from '../../../API';

const ManageOrderScreen = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  const itemsPerPage = useItemsPerPage(5, 10, 10, 15, 20);
  //! rootState
  const orderSelector = useSelector((state) => state.order);

  //! localState: Search/Pagination
  const [search, setSearch] = React.useState({
    keyword: '',
    status: '',
  }); //! search orderId, status, name, address...
  const [keyword, setKeyword] = React.useState('');
  console.log('__Debugger__ManageOrderScreen\n__***__keyword: ', keyword, '\n');

  const [sort, setSort] = React.useState('createdAt');
  const [order, setOrder] = React.useState(-1);
  const [currentPage, setCurrentPage] = React.useState(1);

  //! localState: Select Ids
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState('');

  //! localState: actionType
  const [actionType, setActionType] = React.useState('');

  //! localState: Modal
  const [showModal, setShowModal] = React.useState(false);
  const [modalOptions, setModalOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: 'success',
    title: '',
    message: '',
    button: '',
  });

  React.useEffect(() => {
    loadOrdersByFilters();
  }, [sort, order, currentPage, itemsPerPage, search]);

  //! clear Search whenever Change the Tab
  React.useEffect(() => {}, [search.status]);

  //! un-check All if selectedIds equal to 0
  React.useEffect(() => {
    if (selectedIds.length !== 0) return;

    if (isCheckAll) {
      handleCheckAllChange();
    }
  }, [selectedIds]);

  function loadOrdersByFilters() {
    dispatch(
      getOrdersByFilters({
        sort: sort,
        order: order,
        page: currentPage,
        perPage: itemsPerPage,
        search: search,
      })
    );
  }

  function handleOpenModal(actionType, ids) {
    //! clear Form
    handleHideAlert();

    setActionType(actionType);

    let selectedOrders;
    if (_.isArray(ids)) {
      //! multiple Ids
      setSelectedIds(ids);
      selectedOrders = ids?.map((id) =>
        orderSelector.orders.find((order) => order._id === id)
      );
    } else {
      //! single Id
      //! bổ sung: fix lại multiple selectedIds sau khi xóa id single Ids
      setSelectedId(ids);
      selectedOrders = [
        orderSelector.orders.find((order) => order._id === ids),
      ];
    }

    switch (actionType) {
      /* DELETE ONE ORDER */
      case constants.order.actionTypes.DELETE_ORDER:
        setModalOptions({
          variant: 'warning',
          title: `Xác nhận xóa hóa đơn`,
          message: `Bạn có muốn xóa hóa đơn này không? [Người nhận: ${selectedOrders[0]?.name}, Tình trạng: ${selectedOrders[0]?.status}]`,
          nameButton: 'Xác nhận xóa',
        });

        break;
      /* DELETE_ORDERS */
      case constants.order.actionTypes.DELETE_ORDERS:
        setModalOptions({
          variant: 'warning',
          title: `Xác nhận xóa nhiều hóa đơn`,
          message: `Bạn có muốn xóa những hóa đơn này không? [Người nhận: ${selectedOrders[0]?.name}, Tình trạng: ${selectedOrders[0]?.status}, ...]`,
          nameButton: 'Xác nhận xóa nhiều',
        });

        break;

      default:
        setAlertOptions({
          variant: 'danger',
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
    console.log('handleSubmit');
    try {
      //! single Ids
      if (actionType === constants.order.actionTypes.DELETE_ORDER) {
        /* REMOVE USER ACCOUNT */
        const response = await dispatch(deleteOrder(selectedId)).unwrap();

        setAlertOptions({
          variant: response.success ? 'success' : 'danger',
          title: `Xóa hóa đơn thành công`,
          message: response.message,
        });

        checkSelectedIds();
      } else if (actionType === constants.order.actionTypes.DELETE_ORDERS) {
        /* RESET PASSWORD */
        const response = await dispatch(deleteOrders(selectedIds)).unwrap();
        setAlertOptions({
          variant: response.success ? 'success' : 'danger',
          title: `Xóa nhiều hóa đơn thành công`,
          message: response.message,
        });

        resetCheckAll();
      }

      handleHideModal();
      handleShowAlert();
      //! re-load
      loadOrdersByFilters();
      // checkSelectedIds();

      //! gotoTop
      scrollToTop();
    } catch (error) {
      handleHideModal();
      handleShowAlert();
      
      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });

      toast.error(error.response?.message || error.massage);
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
    if (setSelectedIds.length === 0 && isCheckAll) {
      setIsCheckAll(false);
    }
  }

  function handleCheckAllChange() {
    setIsCheckAll(!isCheckAll);
    if (!isCheckAll) {
      setSelectedIds(orderSelector.orders?.map((order) => order._id));
    } else {
      setSelectedIds([]); //! unticked
    }
  }

  function triggerSelectChange(eventKey) {
    if (eventKey === constants.order.tabs.ALL_ORDERS) {
      setSearch((prevState) => ({ ...prevState, keyword: '', status: '' }));
    } else {
      setSearch((prevState) => ({
        ...prevState,
        keyword: '',
        status: eventKey,
      }));
    }

    //! clear CheckAll
    resetCheckAll();
  }

  function resetCheckAll() {
    //! reset CheckAll
    setSelectedId('');
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
      title: 'All Orders',
      element: (
        <OrderTabComponent
          orders={orderSelector.orders}
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
      title: 'Pending',
      element: (
        <OrderTabComponent
          orders={orderSelector.orders}
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
      title: 'Paid',
      element: (
        <OrderTabComponent
          orders={orderSelector.orders}
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
      title: 'Completed',
      element: (
        <OrderTabComponent
          orders={orderSelector.orders}
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
      title: 'Canceled',
      element: (
        <OrderTabComponent
          orders={orderSelector.orders}
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
  ];

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-1', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-2',
      label: 'Quản lý Tài khoản',
      path: '/admin/users',
      active: true,
    },
  ];

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        alwaysShown={true}
      />
      <div className="col-10 col-md-11">
        {/* <ToolbarSearchComponent search={search} setSearch={setSearch} /> */}
      </div>
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
          itemsCount={orderSelector.ordersCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          alwaysShown={false}
        />
      </div>
      <ConfirmationModalComponent
        showModal={showModal}
        variant={modalOptions.variant}
        title={modalOptions.title}
        nameButton={modalOptions.nameButton}
        message={modalOptions.message}
        handleHideModal={handleHideModal}
        handleSubmit={handleConfirmationSubmit}
      />
      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default ManageOrderScreen;
