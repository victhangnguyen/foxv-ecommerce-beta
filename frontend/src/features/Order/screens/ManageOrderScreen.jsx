import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';
import ControlledtabsComponent from '../../../components/Form/ControlledTabsComponent';
//! imp Comps:tabs
import OrderTabComponent from '../components/OrderTabComponent';
//! imp Hooks
import { useItemsPerPage } from '../../../hooks/itemsPerPage';
import { useScrollPosition } from '../../../hooks/scroll';
//! imps Actions
import { getOrdersByFilters } from '../OrderSlice';
//! imps Constants
import constants from '../../../constants';

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

  const [sort, setSort] = React.useState('createdAt');
  const [order, setOrder] = React.useState(-1);
  const [currentPage, setCurrentPage] = React.useState(1);

  //! localState: Select Ids
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);

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
    resetCheckAll();
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

  function handleConfirmationSubmit() {
    //! localFunction
  }

  function handleHideAlert() {
    showAlert(false);
  }

  function handleShowAlert() {
    showAlert(true);
  }

  function handleHideModal() {
    showModal(false);
  }

  function handleShowModal() {
    showModal(true);
  }

  function handleCheckChange(e) {
    const { id, checked } = e.target;
    console.log('id: ', id);
    console.log('checked: ', checked);
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

  const selectedIdsCountRef = React.useRef(0);
  console.log(
    '%c__Debugger__ManageOrderScreen\n__***__selectedIds__',
    'color: chartreuse;',
    (selectedIdsCountRef.current += 1),
    ':',
    selectedIds,
    '\n'
  );

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
    if (isCheckAll) {
      handleCheckAllChange();
    }
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
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        show={showAlert}
        setShow={setShowAlert}
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
// {orderSelector.orders?.length > 0 &&
//   orderSelector.orders?.map((order) => {
//     return (
//       <Col key={order._id} xs={12}>
//         <p>{order._id}</p>
//         {/* <AdminUserCard
//           entity={entity}
//           handleShowModal={handleShowModal}
//         /> */}
//       </Col>
//     );
//   })}
