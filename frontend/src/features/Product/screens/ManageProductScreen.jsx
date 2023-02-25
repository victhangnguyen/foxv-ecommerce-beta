import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';

//! imp Actions RTK
import {
  fetchProductsByFilters,
  removeProduct,
  removeProducts,
} from '../ProductSlice';

import { clearSearch } from '../../Search/SearchSlice';

//! imp Components
import BreadcrumbComponent from '../../../components/Breadcrumbs/BreadcrumbComponent';
import DeleteConfirmationModalComponent from '../components/Modals/DeleteConfirmationModalComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import ToolbarComponent from '../../../components/Toolbars/ToolbarComponent';
import AdminLoadingProductCard from '../components/Cards/AdminLoadingProductCard';
import AdminProductCard from '../components/Cards/AdminProductCard';
import AlertDismissibleComponent from '../../../components/Alerts/AlertDismissibleComponent';

const REACT_APP_PERPAGE = 18;

const ManageProductScreen = () => {
  const [sort, setSort] = React.useState('createdAt');
  const [order, setOrder] = React.useState('desc');

  const [currentPage, setCurrentPage] = React.useState(1);
  // const productsPerPage = useHookWidth
  //! used to make LoadingCard by PaginationComponent
  const [productsCountPerPage, setProductsCountPerPage] =
    React.useState(REACT_APP_PERPAGE);

  //! Toolbars
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [checkedProductIds, setCheckedProductIds] = React.useState([]); //! Nhung doi tuong checkAll co trong product

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    {
      label: 'Dashboard',
      path: '/admin',
    },
    { label: 'Quản lý Sản phẩm', path: '/admin/products', active: true },
  ];

  //! local state DeleteComfirmationModalComponent
  const [deleteType, setDeleteType] = React.useState(null); //! single or multiple
  const [deleteIds, setDeleteIds] = React.useState(null); //! id
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState(null);
  const [singleMessage, setSingleMessage] = React.useState(null);
  const [multipleMessage, setMultipleMessage] = React.useState(null);

  //! state Alert
  const [showAlert, setShowAlert] = React.useState(false);

  //! stateRedux:
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);
  const search = useSelector((state) => state.search);

  //! effect deps: Pagination, Search
  React.useEffect(() => {
    loadAllProducts();
  }, [search, sort, order, currentPage]);

  React.useEffect(() => {
    return () => dispatch(clearSearch());
  }, []);

  //! effect Error
  React.useEffect(() => {
    product.error && toast.error(product.error);
  }, [product.error]);

  //! slug, _id,
  const loadAllProducts = () => {
    dispatch(
      fetchProductsByFilters({
        search,
        sort,
        order,
        page: currentPage,
        perPage: REACT_APP_PERPAGE,
      })
    );
  };

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    if (!isCheckAll) {
      setCheckedProductIds(product.products.map((product) => product._id));
    } else {
      setCheckedProductIds([]); //! unticked
    }
  };

  const handleDelete = async (productId) => {
    try {
      const deletedProduct = await dispatch(removeProduct(productId)).unwrap();
      toast.success(`Sản phẩm ${deletedProduct.name} đã được xóa`);
      loadAllProducts();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteAll = (productIds) => {
    dispatch(removeProducts(productIds))
      .unwrap()
      .then((result) => {
        setCheckedProductIds([]);
        loadAllProducts();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleCardCheckChange = (e) => {
    const { id, checked } = e.target;
    if (!checked) {
      setCheckedProductIds(
        checkedProductIds.filter((productId) => productId !== id)
      );
    } else {
      setCheckedProductIds([...checkedProductIds, id]);
    }
    //! reset isCheckAll
    if (checkedProductIds.length === 0 && isCheckAll) {
      setIsCheckAll(false);
    }
  };

  //! DeleteConfirmationModal

  const deleteTypeCountRef = React.useRef(0);
  const handleShowDeleteModal = (type, productIds) => {
    setDeleteIds(productIds); //! string or array
    setDeleteType(type); //! single or multiple
    setSingleMessage(null);
    setMultipleMessage(null);

    console.log(
      '%c__Debugger__ManageProductScreen\n__handleShowDeleteModal__deleteType__',
      'color: chartreuse;',
      (deleteTypeCountRef.current += 1),
      ':',
      deleteType,
      '\n'
    );

    if (type === 'single') {
      setDeleteMessage(
        // fruits.find((x) => x.id === id).name
        `Bạn có muốn xóa sản phẩm [${
          product.products.find((product) => product._id === productIds).name
        }] này không?`
      );
      setSingleMessage(
        // fruits.find((x) => x.id === id).name
        `Bạn đã xóa sản phẩm [${
          product.products.find((product) => product._id === productIds).name
        }] thành công.`
      );
    } else if (type === 'multiple') {
      setDeleteMessage(
        `Có ${productIds.length} sản phẩm chờ được xóa. Bạn muốn xóa không?`
      );
      setMultipleMessage(
        `Bạn đã xóa ${productIds.length} sản phẩm thành công.`
      );
    }
    //! show Modal
    setShowConfirmationModal(true);
  };

  const handleHideModal = () => {
    setShowConfirmationModal(false);
  };

  //! handle the deletion of the product
  const consCountRef = React.useRef(0);
  const handleSubmitDelete = () => {
    console.log(
      '%c__Debugger__ManageProductScreen\n__handleSubmitDelete__',
      'color: Gold;',
      (consCountRef.current += 1),
      '\n'
    );
    if (deleteType === 'single') {
      //! single Id
      handleDelete(deleteIds);
    } else if (deleteType === 'multiple') {
      //! multiple Ids
      handleDeleteAll(deleteIds);
    }
    handleHideModal();
    setShowAlert(true);
    // clearMessage();
  };

  const clearAlertMessage = () => {
    setDeleteMessage('');
    setMultipleMessage('');
    setSingleMessage('');
  };

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <h1>Quản lý Sản phẩm </h1>
      {singleMessage ? (
        <AlertDismissibleComponent
          show={showAlert}
          setShow={setShowAlert}
          variant="success"
        >
          {singleMessage}
        </AlertDismissibleComponent>
      ) : null}
      {multipleMessage ? (
        <AlertDismissibleComponent
          show={showAlert}
          setShow={setShowAlert}
          variant="success"
        >
          {multipleMessage}
        </AlertDismissibleComponent>
      ) : null}

      <ToolbarComponent
        setSort={setSort}
        setOrder={setOrder}
        role="toolbar"
        aria-label="Toolbar with button groups"
        isCheckAll={isCheckAll}
        checkedProductIds={checkedProductIds}
        currentPage={currentPage}
        handleCheckChange={handleSelectAll}
        handleShowDeleteModal={handleShowDeleteModal}
      />
      {product.loading === true ? (
        <AdminLoadingProductCard count={productsCountPerPage} />
      ) : (
        <>
          <Row>
            {
              //! Container that in main (App-index.js)
            }
            {product.products?.length > 0 &&
              product.products?.map((product) => {
                return (
                  <Col key={product._id} xs={6} sm={4} md={3} lg={2}>
                    <AdminProductCard
                      product={product}
                      handleDelete={handleDelete}
                      checkedProductIds={checkedProductIds}
                      handleCheckChange={handleCardCheckChange}
                      handleShowDeleteModal={handleShowDeleteModal}
                    />
                  </Col>
                );
              })}
          </Row>
          <div className="d-flex justify-content-center">
            <PaginationComponent
              currentPage={currentPage}
              itemsCount={product.productsCount}
              itemsPerPage={REACT_APP_PERPAGE}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
      <DeleteConfirmationModalComponent
        type={deleteType}
        ids={deleteIds}
        showModal={showConfirmationModal}
        message={deleteMessage}
        handleHideModal={handleHideModal}
        handleSubmitDelete={handleSubmitDelete}
      />
    </>
  );
};

export default ManageProductScreen;
