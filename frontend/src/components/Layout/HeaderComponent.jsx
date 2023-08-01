import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//! imp Comps
import {
  Container,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from 'react-bootstrap';

//! imp Services
import API from '../../API';

//! imp Actions
import { signout } from '../../features/Auth/AuthSlice';
import { postCart } from '../../features/Cart/CartSlice';
import { emptyNewOrder } from '../../features/Order/OrderSlice';

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //! reduxState
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  //! varibale form auth
  const userId = auth?.user?._id;
  const roles = auth.user?.roles?.map((role) => role.name);
  const isAuthenticated = roles?.includes('user');
  const isAdmin = roles?.includes('admin');
  const token = auth.token;
  //! variable from cart
  //! total items quantity
  const itemsCount = cart.cartItems?.reduce((acc, cur) => +cur.quantity + acc, 0);

  const badgeProps = {};

  if (itemsCount) {
    badgeProps.count = itemsCount;
  }

  //! localState: selected
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);

  async function handleLogout() {
    try {
      //! if no Token then signout
      if (token) {
        //! save Cart to database
        // await dispatch(postCart()).unwrap(); //! not authenticated
      }

      //! logout
      dispatch(signout());

      //! empty Order
      dispatch(emptyNewOrder());

      navigate('/auth/login');
      toast.success(`${auth.user.lastName} has successfully signed out!`);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  React.useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const loadCategories = async () => {
    const filterOptions = {
      sort: 'createdAt',
      order: -1,
      page: 1,
      perPage: 10,
    };
    const response = await API.category.getCategoriesByFilters(filterOptions);

    setCategories(response.data?.categories); //! vrf ?.cate..
  };

  const loadSubCategories = async () => {
    const filterOptions = {
      sort: 'createdAt',
      order: -1,
      page: 1,
      perPage: 10,
    };
    const response = await API.subCategory.getSubCategoriesByFilters(
      filterOptions
    );
    setSubCategories(response.data?.subCategories); //! vrf ?.sub...
  };

  const renderCategoryHeader = categories?.map((category) => (
    <NavLink
      key={category._id}
      className={'nav-link'}
      to={`/collections/${category.slug}`}
    >
      <NavDropdown.Item as="div">{category.name}</NavDropdown.Item>
    </NavLink>
  ));

  const renderSubCategoryHeader = subCategories?.map((sub) => (
    <NavLink
      key={sub._id}
      className={'nav-link'}
      to={`/collections/sub/${sub.slug}`}
    >
      <NavDropdown.Item as="div">{sub.name}</NavDropdown.Item>
    </NavLink>
  ));
  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand>
            <NavLink to={'/'}>
              <Image src="/assets/images/icon-foxv.png" />
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                <b>Foxv Ecommerce</b>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {
                //! Nav me-auto (margin-end)
              }
              <Nav className="me-auto">
                {/* <Nav.Link as="div">
                  <NavLink className={'nav-link'} to={'/promotion'}>
                    Khuyến mãi
                  </NavLink>
                </Nav.Link> */}
                <Nav.Link as={'div'}>
                  <NavLink className={'nav-link'} to={'/shop'}>
                    Shop
                  </NavLink>
                </Nav.Link>
                <NavDropdown
                  className={'nav-link'}
                  title="Kiểu sản phẩm"
                  id="collasible-nav-dropdown"
                >
                  {renderCategoryHeader}
                </NavDropdown>{' '}
                <NavDropdown
                  className={'nav-link'}
                  title="Loại sản phẩm"
                  id="collasible-nav-dropdown"
                >
                  {renderSubCategoryHeader}
                </NavDropdown>
              </Nav>
              {
                //! Nav
              }
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {isAdmin ? (
                  <>
                    <NavLink className="nav-link" to={'/admin/products'}>
                      Quản lý Sản phẩm
                    </NavLink>
                    <NavLink className="nav-link" to={'/cart'}>
                      <strong className="orders-badge" {...badgeProps}>
                        {/* <Cartstrongcon size="1.5rem" /> */}
                        Mua hộ
                      </strong>
                    </NavLink>
                  </>
                ) : (
                  <NavLink className={'nav-link'} to={`/cart`}>
                    <i className="orders-badge" {...badgeProps}>
                      {/* <CartIcon size="1.5rem" /> */}
                      <FontAwesomeIcon
                        color="black"
                        size="lg"
                        icon="fa-solid fa-bag-shopping"
                      />
                    </i>
                  </NavLink>
                )}
                {isAuthenticated ? (
                  <>
                    <NavDropdown
                      title={auth.user?.firstName}
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      <NavDropdown.Item as="div">
                        {' '}
                        <NavLink
                          className="nav-link"
                          to={
                            isAdmin
                              ? `/admin/users/${userId}/update`
                              : `/users/${userId}/update`
                          }
                        >
                          Profiles
                        </NavLink>
                      </NavDropdown.Item>
                      <NavDropdown.Item as="div">
                        {isAdmin ? (
                          <NavLink className="nav-link" to={'/admin'}>
                            Dashboard
                          </NavLink>
                        ) : (
                          <NavLink className="nav-link" to={`/users/${userId}`}>
                            Setting
                          </NavLink>
                        )}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as="div" onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <NavLink className="nav-link" to="/auth/register">
                      Đăng ký
                    </NavLink>
                    <NavLink className="nav-link" to="/auth/login">
                      Đăng nhập
                    </NavLink>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default HeaderComponent;
