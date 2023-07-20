import React from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";

//! imp Comps
import BreadcrumbComponent from "../../../components/Breadcrumb/BreadcrumbComponent";
import AlertDismissibleComponent from "../../../components/Alert/AlertDismissibleComponent";
import ProductImageComponent from "../components/ProductImageComponent";

import API from "../../../API";
//! imp Actions
import { addToCart, removeItem } from "../../Cart/CartSlice";

const ProductDetailScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams(); //! productSlug
  const cart = useSelector((state) => state.cart);

  //! localState: init
  const [loading, setLoading] = React.useState(false);
  const [qty, setQty] = React.useState(1);
  const [product, setProduct] = React.useState({});
  //! localState: alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: "",
    title: "",
    message: "",
  });

  const isAddedToCard = cart.cartItems
    .map((item) => item.product)
    .includes(product._id);

  const cartProductQuantity =
    cart.cartItems?.find((item) => item.product === product._id)?.quantity || 0;

  const isPurchasePossible = cartProductQuantity < product.quantity;

  React.useEffect(() => {
    loadProductBySlug(slug);
  }, []);

  const loadProductBySlug = async (slug) => {
    setLoading(true);
    try {
      const response = await API.product.getProductBySlug(slug);
      setLoading(false);
      setProduct(response.data.product);
    } catch (error) {
      setLoading(false);
      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
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
    /* action.payload ~ {
      productId: _id,
      title, image, price
    }
    */
    const cartItem = {
      product: product._id,
      quantity: 1,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.images[0],
      price: product.price,
    };
    dispatch(addToCart(cartItem));
  }

  function handleClickRemoveItem() {
    dispatch(removeItem(product._id));
  }

  function handleClickBuyNow() {
    navigate(
      isAddedToCard ? `/cart` : `/cart/${product?._id}?qty=${qty ? qty : 1}`
    );
  }

  const breadcrumbItems = [
    { key: "breadcrumb-item-0", label: "Home", path: "/" },
    {
      key: "breadcrumb-item-1",
      label: product.category?.name,
      path: `/collections/${product.category?.slug}`,
    },
    {
      key: "breadcrumb-item-2",
      label: product.name,
      path: `/products/${product.slug}`,
      active: true,
    },
  ];

  return (
    <Container>
      <AlertDismissibleComponent
        show={showAlert}
        setShow={setShowAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
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
                <Col as="aside" md={5}>
                  <article className="gallery-wrap">
                    <div className="thumbs-wrap">
                      <ProductImageComponent product={product} />
                    </div>
                  </article>
                </Col>
                <Col md={7} as="main">
                  <article>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="card-id">
                      ID sản phẩm: {product._id}
                    </Card.Text>
                    <Card.Text className="card-category">
                      <span className="me-2">Loại:</span>
                      <Link to={`/collections/${product?.category.slug}`}>
                        <strong>{product.category?.name}</strong>
                      </Link>
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
                      <Card.Text className="card-price h5">
                        Giá sản phẩm: {product.price}
                      </Card.Text>{" "}
                    </div>
                    <div className="mb-4">
                      <Button
                        size="sm"
                        className={`me-2 ${!product?.quantity ? "d-none" : null}`}
                        variant={isAddedToCard ? "warning" : "primary"}
                        onClick={handleClickBuyNow}
                      >
                        {isAddedToCard ? "Xem giỏ" : "Mua ngay"}
                      </Button>

                      <Button
                        size="sm"
                        disabled={!isPurchasePossible}
                        variant={"success"}
                        onClick={handleClickAddToCart}
                        className={
                          product?.quantity === 0
                            ? "btn-sold-out"
                            : isPurchasePossible
                            ? null
                            : "btn-disable"
                        }
                      >
                        <i className="fa fa-shopping-bag"></i>{" "}
                        {product?.quantity === 0
                          ? "Đã bán hết"
                          : isPurchasePossible
                          ? "Thêm vào Giỏ"
                          : `Chỉ còn ${cartProductQuantity} SP`}
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
                    1. Giảm giá khi mua hàng: Thành viên có thể được giảm giá
                    khi mua sản phẩm.
                  </p>
                  <p>
                    2. Quà tặng và ưu đãi đặc biệt: Thành viên cũng có thể được
                    tặng quà và nhận được các ưu đãi đặc biệt…
                  </p>
                  <p>
                    3. Tham gia sự kiện và chương trình khuyến mãi: Thành viên
                    cũng có thể được mời tham gia các sự kiện và chương trình
                    khuyến mãi độc quyền.
                  </p>
                  <p>
                    4. Giao hàng nhanh và dịch vụ chăm sóc khách hàng tốt: Thành
                    viên còn được đảm bảo nhận được sản phẩm nhanh chóng và dịch
                    vụ chăm sóc khách hàng tốt nhất.
                  </p>
                  <p>
                    5. Giảm thiểu thời gian đăng ký và thanh toán: Thành viên đã
                    đăng ký trên trang web của bạn sẽ không cần phải nhập lại
                    thông tin cá nhân trong quá trình thanh toán và giao dịch
                    tiếp theo.
                  </p>
                </Col>
              </Row>
              <hr />
              <p>
                Chúng tôi xin cảm ơn quý khách hàng đã đồng hành cùng chúng tôi
                trong suốt thời gian vừa qua. Chúng tôi rất trân trọng sự tin
                tưởng và hỗ trợ mà quý khách hàng đã dành cho chúng tôi.
              </p>
            </div>
          </article>
        </section>
      )}
    </Container>
  );
};

export default ProductDetailScreen;
