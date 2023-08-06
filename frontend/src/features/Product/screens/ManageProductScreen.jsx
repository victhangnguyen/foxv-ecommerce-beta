import _ from 'lodash';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

//! imp Components
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import AdminProductCard from '../components/Card/AdminProductCard';
import ToolbarComponent from '../components/Toolbars/ToolbarComponent';
import ProductToolbarComponent from '../components/Toolbars/ProductToolbarComponent';

//! imp Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useItemsPerPage } from '../../../hooks/itemsPerPage';
import { scrollToTop, useScrollPosition } from '../../../hooks/scroll';

//! imp Actions
import { getProductsByFilters } from '../ProductSlice';

//! imp Constants
import constants from '../../../constants';

//! imp APIs
import API from '../../../API';

const ManageProductScreen = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  const itemsPerPage = useItemsPerPage(10, 15, 20, 30, 30);

  //! rootState
  const { products, productsCount } = useSelector((state) => state.product);

  //! localState: init
  const [loading, setLoading] = React.useState(false);

  //! localState: FilterOpts/Pagination
  const [filterOpts, seFilterOpts] = React.useState({
    keyword: '',
    price: '',
    category: '',
  });

  const [sort, setSort] = React.useState('updatedAt');
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
  const [modalOpts, setModalOpts] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: 'success',
    title: '',
    message: '',
    button: '',
  });

  //! effect deps: Pagination, Search
  React.useEffect(() => {
    loadProductsByFilters();
  }, [sort, order, currentPage, itemsPerPage, filterOpts]);

  //! un-check All if selectedIds equal to 0
  React.useEffect(() => {
    if (selectedIds.length !== 0) return;

    if (isCheckAll) {
      handleCheckAllChange();
    }
  }, [selectedIds]);

  //! slug, _id,
  async function loadProductsByFilters() {
    try {
      setLoading(true);
      dispatch(
        getProductsByFilters({
          sort: sort,
          order: order,
          page: currentPage,
          perPage: itemsPerPage,
          filterOpts: filterOpts,
        })
      );
      setLoading(false);
    } catch (error) {
      handleShowAlert();

      setLoading(false);
      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });
    }
  }

  function deleteOneProduct() {
    //! localFunction
  }

  function deleteManyProduct() {
    //! localFunction
  }

  function handleCheckAllChange() {
    setIsCheckAll(!isCheckAll);
    if (!isCheckAll) {
      setSelectedIds(products?.map((product) => product._id));
    } else {
      setSelectedIds([]); //! unticked
    }
  }

  function handleCheckChange(e) {
    const { id, checked } = e.target;

    if (!checked) {
      setSelectedIds((prevState) =>
        prevState.filter((productId) => productId !== id)
      );
    } else {
      setSelectedIds((prevState) => [...prevState, id]);
    }
  }

  function handleOpenModal(actionType, ids) {
    //! clear Form
    handleHideAlert();

    setActionType(actionType);

    let selectedProducts;
    if (_.isArray(ids)) {
      //! multiple Ids
      setSelectedIds(ids);
      selectedProducts = ids?.map((id) =>
        products.find((product) => product._id === id)
      );
    } else {
      //! single Id
      //! bổ sung: fix lại multiple selectedIds sau khi xóa id single Ids
      setSelectedId(ids);
      selectedProducts = [products.find((product) => product._id === ids)];
    }

    switch (actionType) {
      /* DELETE_ONE_PRODUCT */
      case constants.product.actionTypes.DELETE_ONE_PRODUCT:
        console.log(
          '__Debugger__ManageProductScreen\n__DELETE_ONE_PRODUCT__selectedProducts[0]: ',
          selectedProducts[0]?.category.name,
          '\n'
        );
        setModalOpts({
          variant: 'warning',
          title: `Xác nhận xóa sản phẩm`,
          message: `Bạn có muốn xóa sản phẩm này không? [Tên sản phẩm: ${selectedProducts[0]?.name}, Kiểu: ${selectedProducts[0]?.category.name}]`,
          nameButton: 'Xác nhận xóa',
        });

        break;
      /* DELETE_MANY_PRODUCTS */
      case constants.product.actionTypes.DELETE_MANY_PRODUCTS:
        setModalOpts({
          variant: 'warning',
          title: `Xác nhận xóa nhiều sản phẩm`,
          message: `Bạn có muốn xóa những sản phẩm này không? [Tên sản phẩm: ${selectedProducts[0]?.name}, Kiểu: ${selectedProducts[0]?.category.name}, ...]`,
          nameButton: 'Xác nhận xóa nhiều',
        });

        break;

      default:
        setAlertOpts({
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
    try {
      //! single Ids
      if (actionType === constants.product.actionTypes.DELETE_ONE_PRODUCT) {
        /* DELETE_ONE_PRODUCT */
        const response = await API.product.deleteProductById(selectedId);
        console.log(
          '__Debugger__ManageProductScreen\n__handleConfirmationSubmit__response: ',
          response,
          '\n'
        );
        setAlertOpts({
          variant: response.success ? 'success' : 'danger',
          title: `Xóa sản phẩm thành công`,
          message: `Bạn đã xóa sản phẩm [Tên: ${response.data.deletedProduct.name}] thành công!`,
        });

        checkSelectedIds();
      } else if (
        actionType === constants.product.actionTypes.DELETE_MANY_PRODUCTS
      ) {
        /* DELETE_MANY_PRODUCTS */
        // const response = await dispatch(deleteOrders(selectedIds)).unwrap();
        const response = await API.product.deleteProductsByIds(selectedIds);
        setAlertOpts({
          variant: response.success ? 'success' : 'danger',
          title: `Xóa nhiều sản phẩm thành công`,
          message: `Bạn đã xóa sản phẩm [Tên: ${response.data.deletedProducts[0].name}, ...] thành công!`,
        });

        resetCheckAll();
      }

      handleHideModal();
      handleShowAlert();
      //! re-load
      loadProductsByFilters();

      //! gotoTop
      scrollToTop();
    } catch (error) {
      handleHideModal();
      handleShowAlert();

      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });

      toast.error(error.response?.message || error.massage);
    }
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

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-1', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-2',
      label: 'Quản lý Sản phẩm',
      path: '/admin/products',
      active: true,
    },
  ];

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <h1>Quản lý Sản phẩm </h1>
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        alwaysShown={true}
      />
      {
        //! ProductToolbarComponent
      }
      <ProductToolbarComponent
        seFilterOpts={seFilterOpts}
        isCheckAll={isCheckAll}
        selectedIds={selectedIds}
        handleCheckAllChange={handleCheckAllChange}
        handleOpenModal={handleOpenModal}
      />

      {/* <ToolbarComponent
        setSort={setSort}
        setOrder={setOrder}
        role="toolbar"
        aria-label="Toolbar with button groups"
        isCheckAll={isCheckAll}
        selectedIds={selectedIds}
        currentPage={currentPage}
        handleCheckAllChange={handleCheckAllChange}
        handleShowDeleteModal={handleShowDeleteModal}
      /> */}
      <>
        <Row>
          {
            //! Container that in main (App-index.js)
          }
          {products?.length > 0 &&
            products?.map((product) => {
              return (
                <Col key={product._id} xs={6} sm={4} md={3} lg={2}>
                  <AdminProductCard
                    product={product}
                    selectedIds={selectedIds}
                    handleCheckChange={handleCheckChange}
                    handleOpenModal={handleOpenModal}
                  />
                </Col>
              );
            })}
        </Row>
        <div className="d-flex justify-content-center">
          <PaginationComponent
            currentPage={currentPage}
            itemsCount={productsCount}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            alwaysShown={false}
          />
        </div>
      </>
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

export default ManageProductScreen;
