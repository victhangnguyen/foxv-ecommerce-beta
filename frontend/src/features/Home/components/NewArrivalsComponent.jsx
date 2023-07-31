import React from 'react';
import { Col, Row } from 'react-bootstrap';
//! imp Hookds
import { useItemsPerPage } from '../../../hooks/itemsPerPage';

//! imp Components
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import LoadingProductCard from '../../Product/components/Card/LoadingProductCard';
import ProductCard from '../../Product/components/Card/ProductCard';

//! imp APIs
import API from '../../../API';

const NewArrivalsComponent = ({ title }) => {
  const itemsPerPage = useItemsPerPage(4, 4, 6, 8, 8);

  //! localState:
  const [loading, setLoading] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [products, setProducts] = React.useState([]);
  const [productsCount, setProductsCount] = React.useState(0);

  React.useLayoutEffect(() => {
    loadAllProducts();
  }, [currentPage, itemsPerPage]);

  async function loadAllProducts() {
    const response = await API.product.getProductList({
      sort: 'createdAt',
      order: 'desc',
      page: currentPage,
      perPage: itemsPerPage,
    });

    setProducts(response?.data?.products);
    setProductsCount(response?.data?.productsCount);
  }

  return (
    <div className="container">
      <h4 className="jumbotron">{title}</h4>

      {loading === true ? (
        <LoadingProductCard count={itemsPerPage} />
      ) : (
        <>
          <Row>
            {
              //! Container that in main (App-index.js)
            }
            {products?.length > 0 &&
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
          currentPage={currentPage}
          itemsCount={productsCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          alwaysShown={false}
        />
      </div>
    </div>
  );
};

export default NewArrivalsComponent;
