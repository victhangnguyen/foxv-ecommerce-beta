import React from 'react';
import { useOutlet } from 'react-router-dom';

//! imp Components
import UserNavComponent from '../components/Navbar/UserNavComponent';
import { Row, Col } from 'react-bootstrap';

const UserDashboardScreen = () => {
  const outlet = useOutlet();

  return (
    <Row>
      <Col md="2">
        <UserNavComponent />
      </Col>
      <Col>{outlet}</Col>
    </Row>
  );
};

export default UserDashboardScreen;
