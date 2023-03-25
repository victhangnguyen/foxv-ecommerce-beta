import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
//! imp Components
import LoadingProductCard from '../../Product/components/Card/LoadingProductCard';
import ProductCard from '../../Product/components/Card/ProductCard';

//! imp API
// import categoryService from '../../Category/services/categoryService';

const CollectionScreen = () => {
  const [category, setCategory] = React.useState({});
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { slug } = useParams();

  //! effect DidMount
  React.useEffect(() => {
    setLoading(true);

    // categoryService.getCategory(slug).then((res) => {
    //   setCategory(res.category);
    //   setProducts(res.products);
    //   setLoading(false);
    // });
  }, [slug]);

  return (
    <div className="container">
      <div className="jumbotron">{category.name}</div>
      {loading === true ? (
        <LoadingProductCard count={4} />
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
    </div>
  );
};

export default CollectionScreen;
