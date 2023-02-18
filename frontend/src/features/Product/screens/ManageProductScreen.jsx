import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Actions RTK
import {
  getProductList,
  getProductsCount,
  removeProduct,
  removeProducts,
  fetchProductsByFilter,
} from '../ProductSlice';

//! imp Components
import ToolbarComponent from '../../../components/Toolbars/ToolbarComponent';
import AdminProductCard from '../components/Cards/AdminProductCard';
import AdminLoadingProductCard from '../components/Cards/AdminLoadingProductCard';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';

const ManageProductScreen = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [productsPerPage, setProductsPerPage] = React.useState(18);
  const [productsCountPerPage, setProductsCountPerPage] =
    React.useState(productsPerPage);
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);

  //! Toolbars
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [checkProductIds, setCheckProductIds] = React.useState([]); //! Nhung doi tuong checkAll co trong product

  //! Search
  const search = useSelector((state) => state.search);

  const productproductsCountCountRef = React.useRef(0);
  console.log(
    '%c__Debugger__ManageProductScreen\n__***__product.productsCount__',
    'color: chartreuse;',
    (productproductsCountCountRef.current += 1),
    ':',
    product.productsCount,
    '\n'
  );
  // React.useEffect(() => {
  //   dispatch(getProductsCount());
  // }, []);

  //! effect deps: Pagination, Search
  React.useEffect(() => {
    loadAllProducts();
  }, [search.text, currentPage]);

  // React.useEffect(() => {
  //   setProductsCountPerPage(
  //     product.productsCount - (currentPage - 1) * productsPerPage >=
  //       productsPerPage
  //       ? productsPerPage
  //       : product.productsCount - (currentPage - 1) * productsPerPage
  //   );
  // }, []);

  //! effect Error
  React.useEffect(() => {
    product.error && toast.error(product.error);
  }, [product.error]);

  //! slug, _id,
  const loadAllProducts = () => {
    dispatch(
      fetchProductsByFilter({
        search: { query: search.text },
        sort: 'price',
        order: 'descending',
        page: currentPage,
        perPage: 18,
      })
    );
  };

  const handleRemove = async (productId) => {
    try {
      const deletedProduct = await dispatch(removeProduct(productId)).unwrap();
      toast.success(`Sản phẩm ${deletedProduct.name} đã được xóa`);
      loadAllProducts();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSelectALl = (e) => {
    setIsCheckAll(!isCheckAll);
    if (!isCheckAll) {
      setCheckProductIds(product.products.map((product) => product._id));
    } else {
      setCheckProductIds([]);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await dispatch(removeProducts(checkProductIds)).unwrap();
      loadAllProducts();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCardCheckChange = (e) => {
    const { id, checked } = e.target;
    if (!checked) {
      setCheckProductIds(
        checkProductIds.filter((productId) => productId !== id)
      );
    } else {
      setCheckProductIds([...checkProductIds, id]);
    }
    //! reset isCheckAll
    if (checkProductIds.length === 0 && isCheckAll) {
      setIsCheckAll(false);
    }
  };

  return (
    <div>
      <Row>
        {
          //! Breadcrumb
        }
      </Row>
      <h1>Quản lý Sản phẩm </h1>
      <ToolbarComponent
        role="toolbar"
        aria-label="Toolbar with button groups"
        items={product.products}
        isCheckAll={isCheckAll}
        checkProductIds={checkProductIds}
        handleCheckChange={handleSelectALl}
        handleDelete={handleDeleteAll}
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
                      handleRemove={handleRemove}
                      checkProductIds={checkProductIds}
                      handleCheckChange={handleCardCheckChange}
                    />
                  </Col>
                );
              })}
          </Row>
          <div className="d-flex justify-content-center">
            <PaginationComponent
              currentPage={currentPage}
              itemsCount={product.productsCount}
              itemsPerPage={18}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProductScreen;
