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

  // const [loading, setLoading] = React.useState();
  // const [products, setProducts] = React.useState([]);

  //! effect DidMount
  React.useEffect(() => {
    dispatch(getProductsCount());
  }, []);

  // React.useEffect(() => {
  //   setProductsCountPerPage(
  //     product.productsCount - (currentPage - 1) * productsPerPage >=
  //       productsPerPage
  //       ? productsPerPage
  //       : product.productsCount - (currentPage - 1) * productsPerPage
  //   );
  // }, []);

  //! effect Deps: currentPage
  React.useEffect(() => {
    dispatch(
      getProductList({
        sort: 'createdAt',
        order: 'asc',
        page: currentPage,
        perPage: productsPerPage,
      })
    );
  }, [currentPage]);

  //! effect Depts: product.errror
  React.useEffect(() => {
    product.error && toast.error(product.error);
  }, [product.error]);

  // productAPI
  //   .removeProduct(productId)
  //   .then((data) => {
  //     console.log('__Debugger__AdminProductCard__data: ', data);
  //     loadAllProducts();
  //     toast(`Sản phẩm ${data.name} đã được xóa`);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  const handleRemove = async (productId) => {
    console.log(`%c__Debugger__handleRemove`, 'color: red; font-weight: bold');
    await dispatch(removeProduct(productId))
      .unwrap()
      .then((deletedProduct) => {
        toast.success(`Sản phẩm ${deletedProduct.name} đã được xóa`);
      })
      .catch((error) => {
        toast.error(error);
      });

    await dispatch(
      getProductList({
        sort: 'createdAt',
        order: 'asc',
        page: currentPage,
        perPage: productsPerPage,
      })
    );
  };

  return (
    <div>
      <Row>
        {
          //! Breadcrumb
        }
      </Row>
      <h1>Quản lý Sản phẩm </h1>
      <ToolbarComponent role="toolbar" aria-label="Toolbar with button groups">
        <div
          className="btn-group me-2"
          role="group"
          aria-label="Clipboard group"
        >
          <button type="button" className="btn btn-primary">
            Xóa nhiều
          </button>
        </div>
        {/* <div className="btn-group me-2" role="group" aria-label="Styles group">
          <button type="button" className="btn btn-secondary">
            Font
          </button>
          <button type="button" className="btn btn-secondary">
            Size
          </button>
        </div>
        <div className="btn-group" role="group" aria-label="Source group">
          <button type="button" className="btn btn-success">
            Source
          </button>
        </div> */}
      </ToolbarComponent>

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
                    />
                  </Col>
                );
              })}
          </Row>
          <div className="d-flex justify-content-center">
            <PaginationComponent
              currentPage={currentPage}
              itemsCount={product.productsCount}
              itemsPerPage={productsPerPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProductScreen;
