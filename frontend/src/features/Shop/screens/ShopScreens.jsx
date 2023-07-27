import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

//! imp Hooks
import { useItemsPerPage } from "../../../hooks/itemsPerPage";
import { scrollToTop, useScrollPosition } from "../../../hooks/scroll";

//! imp Comps
import ShopComponent from "../components/ShopComponent";
import SearchFiltersComponent from "../components/SearchFiltersComponent";
import AlertDismissibleComponent from "../../../components/Alert/AlertDismissibleComponent";
import BreadcrumbComponent from "../../../components/Breadcrumb/BreadcrumbComponent";
import GoToButtonComponent from "../../../components/Button/GoToButtonComponent";
import ControlledtabsComponent from "../../../components/Form/ControlledTabsComponent";
import ConfirmationModalComponent from "../../../components/Modal/ConfirmationModalComponent";
import PaginationComponent from "../../../components/Pagination/PaginationComponent";

//! imp Actions
import {
  getProductsByFilters,
  clearNotification,
} from "../../../features/Product/ProductSlice";

const ShopScreens = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  const itemsPerPage = useItemsPerPage(5, 10, 10, 15, 20);

  //! localState: Search/Pagination
  const [search, setSearch] = React.useState({
    keyword: "",
    status: "",
  }); //! search orderId, status, name, address...
  const [keyword, setKeyword] = React.useState("");

  //! localState: init
  const [sort, setSort] = React.useState("updatedAt");
  const [order, setOrder] = React.useState(-1);
  const [currentPage, setCurrentPage] = React.useState(1);
  //! localState: FilterOpts/Pagination
  const [filterOpts, seFilterOpts] = React.useState({
    keyword: "",
    price: "",
    category: "",
  });

  const product = useSelector((state) => state.product);

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

  React.useEffect(() => {
    if (product.success && product.message) {
      setAlertOpts({
        variant: "success",
        title: "Thông báo",
        message: product.message,
      });

      handleShowAlert();
    }
    if (product.success === false && product.error) {
      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message: product.error,
      });

      handleShowAlert();
    }
    return () => {
      dispatch(clearNotification());
    };
  }, [product.success, product.message, product.error]);
  React.useEffect(() => {
    loadProductsByFilters();
  }, [sort, order, currentPage, itemsPerPage, filterOpts]);

  function handleSubmitSearch(data, e, methods) {
    seFilterOpts((prevState) => ({ ...data }));
  }

  function loadProductsByFilters() {
    dispatch(
      getProductsByFilters({
        sort: sort,
        order: order,
        page: currentPage,
        perPage: itemsPerPage,
        filterOpts: filterOpts,
      })
    );
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
    { key: "breadcrumb-item-0", label: "Home", path: "/" },
    {
      key: "breadcrumb-item-1",
      label: "Cửa hàng",
      path: "/shop",
      active: true,
    },
  ];
  return (
    <Container fluid>
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
        <Col md={3}>
          <SearchFiltersComponent handleSubmitSearch={handleSubmitSearch} />
        </Col>
        <Col md={9}>
          <ShopComponent products={product.products} />
        </Col>
      </Row>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          currentPage={currentPage}
          itemsCount={product.productsCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          alwaysShown={false}
          alwayScrollToTop={true}
        />
      </div>
      <GoToButtonComponent visible={scrollPosition > 300} />
    </Container>
  );
};
export default ShopScreens;
