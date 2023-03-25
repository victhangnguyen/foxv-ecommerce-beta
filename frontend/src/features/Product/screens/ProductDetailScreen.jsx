import React from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import ProductImageComponent from '../components/ProductImageComponent';

//! Services
import productService from '../services/productService';
//! imp Actions
import { addToCart } from '../../Cart/CartSlice';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { slug } = useParams(); //! productSlug
  //! localState: init

  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState({});
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
      label: product.category?.name,
      path: `/collections/${product.category?.slug}`,
    },
    {
      key: 'breadcrumb-item-2',
      label: product.name,
      path: `/products/${product.slug}`,
      active: true,
    },
  ];

  console.log('product: ', product);

  React.useEffect(() => {
    loadProductBySlug(slug);
  }, []);

  const loadProductBySlug = async (slug) => {
    setLoading(true);
    try {
      const response = await productService.getProductBySlug(slug);
      setLoading(false);
      setProduct(response.data.product);
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

  const renderSubCategories = () => {
    const subcategoriesList = product.subCategories?.map((sub, index) => (
      <Link key={sub._id} to={`/collections/sub/${sub.slug}`}>
        <li key={index} className="tag">
          <span className="tag-title">{sub.name}</span>
        </li>
      </Link>
    ));
    return (
      <div className="tags-input form-control">
        <ul id="tags">{subcategoriesList}</ul>
      </div>
    );
  };

  function handleClickAddToCart() {
    // action.payload ~ { _id, title, image, price}
    const cartItem = {
      _id: product._id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.images[0],
      price: product.price,
    };
    dispatch(addToCart(cartItem));
  }

  function handleClickBuyNow(e) {
    console.log('__Debugger__ProductDetailScreen\n__handleClickBuyNow', '\n');
  }

  return (
    <Container>
      <AlertDismissibleComponent
        show={showAlert}
        setShow={setShowAlert}
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        alwaysShown={true}
      />
      {!_.isEmpty(product) && (
        <section className="section-content padding-y bg">
          <Card as="article">
            <Card.Body>
              <Row>
                <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
              </Row>
              <Row>
                <Col as="aside" md={4}>
                  <article className="gallery-wrap">
                    <div className="thumbs-wrap">
                      <ProductImageComponent product={product} />
                    </div>
                  </article>
                </Col>
                <Col md={8} as="main">
                  <article>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="card-id">
                      ID sản phẩm: {product._id}
                    </Card.Text>
                    <Card.Text className="card-category">
                      Loại: {product.category?.name}
                    </Card.Text>
                    <Card.Text className="card-category">
                      Kiểu sản phẩm (tags):
                    </Card.Text>
                    {renderSubCategories()}
                    <hr />
                    <div className="mb-3">
                      <h6 className="fw-bold">MÔ TẢ SẢN PHẨM</h6>
                      <Card.Text>{product.description}</Card.Text>
                    </div>
                    <div className="mb-3">
                      <Card.Text className="card-price">
                        {product.price}
                      </Card.Text>{' '}
                    </div>
                    <div className="mb-4">
                      <Button
                        className="me-2"
                        variant="dark"
                        onClick={handleClickBuyNow}
                      >
                        Mua Ngay
                      </Button>
                      <Button variant="primary" onClick={handleClickAddToCart}>
                        Add To Cart
                      </Button>
                    </div>
                    <hr />
                    <h6 className="fw-bold">HƯỚNG DẪN BẢO QUẢN</h6>
                    <p>
                      Giặt tay bằng nước lạnh - Không ngâm, không tẩy - Giặt
                      riêng các sản phẩm khác màu - Không vắt. - Là ủi ở nhiệt
                      độ thấp. Khuyến khích giặt khô.
                    </p>
                  </article>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <article className="card mt-5">
            <div className="card-body">
              <Row>
                <Col as="aside">
                  <h5>Quyền lợi là thành viên của Foxv</h5>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ducimus quae nobis fugiat debitis autem magnam dolor
                    excepturi dolores harum corporis! Aperiam odio voluptatum
                    adipisci debitis vero dolorem natus magnam inventore!
                  </p>
                </Col>
              </Row>
              <hr />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </article>
        </section>
      )}
    </Container>
  );
};

export default ProductDetail;
