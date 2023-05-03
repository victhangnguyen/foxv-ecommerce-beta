import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//! imp Actions
import { signin } from '../AuthSlice';
import { getCart } from '../../Cart/CartSlice';

//! imp Comps
import LoginFormComponent from '../components/LoginFormComponent';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  const cart = useSelector((state) => state.cart);

  const handleLoginSubmit = async (data, e, methods) => {
    const { username, password } = data;
    try {
      const response = await dispatch(signin({ username, password })).unwrap();

      //! load Cart
      await dispatch(getCart());

      const roles = response.data?.user.roles.map((role) => role.name);
      //! navigate
      if (roles?.includes('admin')) {
        navigate('/admin/users');
      } else if (roles?.includes('user')) {
        if (cart.cartItems?.length > 0) {
          return navigate('/cart');
        }
        navigate('/');
      }

      toast.success(response.message);
    } catch (error) {
      //! Error Handling
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors?.length) return;
        errors.forEach((error) => {
          methods.setError(error.param, {
            type: 'server',
            message: error.msg,
          });
        });

        return;
      }

      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });

      handleShowAlert();
    }
  };

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  return (
    <>
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        alwaysShown={true}
      />
      <Row className="d-flex justify-content-center align-items-center">
        <Col xs={12} sm={8} md={8} lg={6} xl={4}>
          <Card className="card-main shadow overflow-hidden">
            <div className="card-line-top"></div>
            <Card.Body className="px-3 px-md-5">
              <div className="mb-3 mt-md-4">
                <h2 className="fw-bold mb-2 text-uppercase ">ĐĂNG NHẬP</h2>
                <p className="mb-2">
                  Đăng nhập để tích điểm và hưởng nhiều ưu đãi thành viên khi
                  mua hàng.
                </p>
                <p className="mb-2">Nhập Email để đăng nhập thành viên FOXV.</p>
                <div className="mt-4">
                  <LoginFormComponent onSubmit={handleLoginSubmit} />
                </div>
                <div className="mb-3">
                  <p className="mb-0">
                    <Link
                      to={'/auth/forgot-password'}
                      className="text-primary fst-italic"
                    >
                      Quên mật khẩu ?
                    </Link>
                  </p>
                </div>
                <div className="mb-3">
                  <p className="mb-0  text-center">
                    Bạn chưa có tài khoản?{' '}
                    <Link
                      to={'/auth/register'}
                      className="text-primary fw-bold"
                    >
                      Đăng ký
                    </Link>
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LoginScreen;
