import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
//! imp Components
import LoadingProductCard from '../../Product/components/Card/LoadingProductCard';
import ProductCard from '../../Product/components/Card/ProductCard';

//! imp API
import subCategoryService from '../../SubCategory/services/subCategoryService';

const SubCollectionScreen = () => {
  const [subCategory, setSubCategory] = React.useState({});
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { slug } = useParams();

  //! effect DidMount
  React.useEffect(() => {
    setLoading(true);

    // subCategoryAPI.getSubCategory(slug).then((res) => {
    //   setSubCategory(res.subCategory);
    //   setProducts(res.products);
    //   setLoading(false);
    // });
  }, [slug]);

  return (
    <div className="container">
      <div className="jumbotron">{subCategory.name}</div>
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

export default SubCollectionScreen;
