import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

//! imp Components

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

  const handleLogout = () => {
    dispatch(signout());
    navigate('/auth/login');
    toast.success(`${auth.user.lastName} has successfully signed out!`);
  };

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
                  <NavDropdown.Item as="div">
                    <NavLink className={'nav-link'} to={`/collections/ao`}>
                      Áo
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    <NavLink className={'nav-link'} to={`/collections/dam`}>
                      Đầm
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    <NavLink className={'nav-link'} to={`/collections/vay`}>
                      Váy
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    <NavLink className={'nav-link'} to={`/collections/quan`}>
                      Quần
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Phụ kiện thời trang
                  </NavDropdown.Item>
                </NavDropdown>{' '}
                <NavDropdown
                  className={'nav-link'}
                  title="SALE OFF"
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
                      <NavLink
                        className="nav-link"
                        to={'/admin/products/create'}
                      >
                        Thêm sản phẩm
                      </NavLink>
                    ) : (
                      <NavLink className={'nav-link'} to={'/cart'}>
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
                          to={isAdmin ? `/admin/users/${userId}/update` : `/users/${userId}/update`}
                        >
                          Profiles
                        </NavLink>
                      </NavDropdown.Item>
                      <NavDropdown.Item as="div">
                        <NavLink
                          className="nav-link"
                          to={isAdmin ? '/admin' : `/users/${userId}`}
                        >
                          Dashboard
                        </NavLink>
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
