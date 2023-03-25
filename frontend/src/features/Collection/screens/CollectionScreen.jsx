import React from 'react';
import { toast } from 'react-toastify';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
//! imp Components
import LoadingProductCard from '../../Product/components/Card/LoadingProductCard';
import ProductCard from '../../Product/components/Card/ProductCard';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';

//! imp Services
import categoryService from '../../Category/services/categoryService';

const CollectionScreen = () => {
  const { slug } = useParams(); //! categorySlug

  //! localState: init
  const [category, setCategory] = React.useState({});
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  //! localState: alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    {
      key: 'breadcrumb-item-1',
      label: 'Shop',
      path: '/shop',
    },
    {
      key: 'breadcrumb-item-2',
      label: category?.name,
      path: `/collections/${slug}`,
      active: true,
    },
  ];

  //! effect DidMount
  React.useEffect(() => {
    loadCategoryBySlug(slug);
  }, [slug]);

  const loadCategoryBySlug = async (slug) => {
    try {
      setLoading(true);
      const response = await categoryService.getCateogryBySlug(slug);
      setLoading(false);
      setCategory(response.data.category);
      setProducts(response.data.products);
    } catch (error) {
      setLoading(false);
      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });
      setShowAlert(true);
      toast.error(error.response?.message || error.massage);
    }
  };

  return (
    <div className="container">
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />

      <AlertDismissibleComponent
        show={showAlert}
        setShow={setShowAlert}
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        alwaysShown={true}
      />

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
