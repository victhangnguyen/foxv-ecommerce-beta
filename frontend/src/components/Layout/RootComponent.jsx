import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

//! imp Components
import { Container } from 'react-bootstrap';
import HeaderComponent from '../Layout/HeaderComponent';
import FooterComponent from '../Layout/FooterComponent';

const RootComponent = () => {
  return (
    <React.Fragment>
      <ToastContainer />
      <HeaderComponent />
      <main>
        <Container fluid>
          <Outlet />
        </Container>
      </main>
      <FooterComponent />
    </React.Fragment>
  );
};

export default RootComponent;
