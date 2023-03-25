import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

//! APIs
import productService from '../services/productService';

//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ProductImageComponent from '../components/ProductImageComponent';

//! imp Actions
import { addToCart } from '../../Cart/CartSlice';

const REACT_APP_SERVER = 'http://127.0.0.1';
const REACT_APP_PORT = 5000;

const ProductDetail = () => {
  const dispatch = useDispatch();
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;
  // const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState({});
  const { productId } = useParams();

  console.log('product: ', product);

  React.useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const product = await productService.getProduct(productId);
    setProduct(product);
  };

  const showSubCategories =
    product.subCategories?.length > 0 &&
    product?.subCategories?.map((sub) => (
      <span key={sub._id}>{sub?.name}</span>
    ));

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    {
      key: 'breadcrumb-item-1',
      label: product.category?.name,
      path: `/category/${product.category?._id}`,
    },
    {
      key: 'breadcrumb-item-2',
      label: product.name,
      path: `/product/${product._id}`,
      active: true,
    },
  ];

  function handleClickAddToCart() {
    // action.payload ~ { _id, title, image, price}
    const cartItem = {
      _id: productId,
      name: product.name,
      category: product.category,
      image: product.images[0],
      price: product.price,
    };
    dispatch(addToCart(cartItem));
  }

  function handleClickBuyNow(e) {
    console.log('__Debugger__ProductDetailScreen\n__handleClickBuyNow', '\n');
    //! localFunction
  }

  return (
    <Container>
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
                    Kiểu: {showSubCategories}
                  </Card.Text>
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
                    Giặt tay bằng nước lạnh - Không ngâm, không tẩy - Giặt riêng
                    các sản phẩm khác màu - Không vắt. - Là ủi ở nhiệt độ thấp.
                    Khuyến khích giặt khô.
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
                  Ducimus quae nobis fugiat debitis autem magnam dolor excepturi
                  dolores harum corporis! Aperiam odio voluptatum adipisci
                  debitis vero dolorem natus magnam inventore!
                </p>
              </Col>
            </Row>
            <hr />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </article>
      </section>
    </Container>
  );
};

export default ProductDetail;
