import React from 'react';
import { useOutlet } from 'react-router-dom';

//! imp Components
import AdminNavComponent from '../components/Navbar/AdminNavComponent';
import { Row, Col } from 'react-bootstrap';

const AdminDashboardScreen = () => {
  const outlet = useOutlet();

  return (
    <Row>
      <Col md="2">
        <AdminNavComponent />
      </Col>
      <Col>{outlet}</Col>
    </Row>
  );
};

export default AdminDashboardScreen;
