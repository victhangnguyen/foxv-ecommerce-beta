import React from 'react';
import { Col, Row } from 'react-bootstrap';

//! imp Components
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import LoadingProductCard from '../../Product/components/Cards/LoadingProductCard';
import ProductCard from '../../Product/components/Cards/ProductCard';

//! imp API
import productService from '../../../features/Product/services/productService';

const PRODUCT_PERPAGE = 4;

const BestSellersComponent = ({ title }) => {
  const [productsPerPage, setProductsPerPage] = React.useState(4);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [productsCount, setProductsCount] = React.useState(0);

  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadAllProducts();
  }, [currentPage]);

  //! effect DidMount
  React.useEffect(() => {
    productService.getProductsCount().then((res) => setProductsCount(res));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    productService
      .getProductList('sold', 'desc', currentPage, PRODUCT_PERPAGE)
      .then((res) => {
        setProducts(res);
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <h4 className="jumbotron">{title}</h4>

      {loading === true ? (
        <LoadingProductCard count={productsPerPage} />
      ) : (
        <>
          <Row>
            {
              //! Container that in main (App-index.js)
            }
            {products.length > 0 &&
              products.map((product) => {
                return (
                  <Col key={product._id} xs={6} md={4} lg={3}>
                    {/* <LoadingProductCard /> */}
                    <ProductCard product={product} />
                  </Col>
                );
              })}
          </Row>
        </>
      )}
      {
        //! Pagination
      }
      <div className="d-flex justify-content-center">
        <PaginationComponent
          itemsCount={productsCount}
          itemsPerPage={productsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BestSellersComponent;
