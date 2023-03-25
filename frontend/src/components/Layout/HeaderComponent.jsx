import { NavLink, useNavigate } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
//! imp Services
import categoryService from '../../features/Category/services/categoryService';
import subCategoryService from '../../features/SubCategory/services/subCategoryService';

//! imp Actions
import { signout } from '../../features/Auth/AuthSlice';

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //! reduxState
  const auth = useSelector((state) => state.auth);
  const userId = auth?.user?._id;
  const roles = auth.user?.roles?.map((role) => role.name);
  const isAuthenticated = roles?.includes('user');
  const isAdmin = roles?.includes('admin');

  //! localState: selected
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);

  const handleLogout = () => {
    dispatch(signout());
    navigate('/auth/login');
    toast.success(`${auth.user.lastName} has successfully signed out!`);
  };

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
    const response = await categoryService.getCategoriesByFilters(
      filterOptions
    );
    setCategories(response.data.categories);
  };

  const loadSubCategories = async () => {
    const filterOptions = {
      sort: 'createdAt',
      order: -1,
      page: 1,
      perPage: 10,
    };
    const response = await subCategoryService.getSubCategoriesByFilters(filterOptions);
    setSubCategories(response.data.subCategories);
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
                <Nav.Link as="div">
                  <NavLink className={'nav-link'} to={'/promotion'}>
                    Khuyến mãi
                  </NavLink>
                </Nav.Link>
                <Nav.Link as={'div'}>
                  <NavLink className={'nav-link'} to={'/shop'}>
                    Shop
                  </NavLink>
                </Nav.Link>
                <NavDropdown
                  className={'nav-link'}
                  title="Sản phẩm"
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
                <NavDropdown
                  className={'nav-link'}
                  title="Bộ sưu tập"
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              {
                //! Nav
              }
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {isAuthenticated ? (
                  <>
                    {isAdmin ? (
                      <NavLink className="nav-link" to={'/admin/products'}>
                        Quản lý Sản phẩm
                      </NavLink>
                    ) : (
                      <NavLink
                        className={'nav-link'}
                        to={`/users/${userId}/cart`}
                      >
                        Giỏ hàng
                      </NavLink>
                    )}
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
