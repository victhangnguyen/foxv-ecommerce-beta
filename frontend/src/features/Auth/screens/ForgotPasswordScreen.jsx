import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alerts/AlertDismissibleComponent';
import ForgotPasswordFormComponent from '../components/ForgotPasswordFormComponent';

const ForgotPasswordScreen = () => {
  //! localState: alert
  const [showAlert, setShowAlert] = React.useState();
  const [alertTypes, setAlertTypes] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  const handleSubmit = async (data, e, methods) => {
    const { email } = data;
    try {
      // const response = await dispatch(signin({ username, password })).unwrap();
    } catch (error) {}
  };

  return (
    <>
      <AlertDismissibleComponent
        variant={'success'}
        title={'Gửi mật khẩu sang email thành công'}
        show={showAlert}
        setShow={setShowAlert}
        alwaysShown={true}
      >
        {}
      </AlertDismissibleComponent>

      <Row className="d-flex justify-content-center align-items-center">
        <Col xs={12} sm={8} md={8} lg={6} xl={4}>
          <Card className="card-main shadow overflow-hidden">
            <div className="card-line-top"></div>
            <Card.Body className="px-3 px-md-5">
              <div className="mb-3 mt-md-4">
                <h2 className="fw-bold mb-2 text-uppercase ">
                  KHÔI PHỤC MẬT KHẨU
                </h2>
                <p className="mb-2">Bận quên mật khẩu rồi hả?</p>
                <p className="mb-2">
                  Nhập email của bạn, chúng tôi sẽ gửi mật khẩu vào trong email
                  của bạn.
                </p>
                <div className="mt-4">
                  <ForgotPasswordFormComponent onSubmit={handleSubmit} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ForgotPasswordScreen;
