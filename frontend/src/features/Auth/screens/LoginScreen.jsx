import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//! imp Actions
import { signin } from '../AuthSlice';

//! imp Comps
import LoginFormComponent from '../components/LoginFormComponent';
import AlertDismissibleComponent from '../../../components/Alerts/AlertDismissibleComponent';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);

  const auth = useSelector((state) => state.auth);

  // React.useEffect(() => {
  //   error && toast.error(error);
  // }, [error]);

  const handleSubmit = async (data, e, methods) => {
    const { username, password } = data;
    try {
      const response = await dispatch(signin({ username, password })).unwrap();

      const roles = response.data.user.roles.map((role) => role.name);

      //! navigate
      if (roles.includes('admin')) navigate('/admin/users');
      else if (roles.includes('user')) navigate('/');

      toast.success(response.message);
      // setShowAlert(true);
    } catch (error) {
      toast.error(auth.error);
      //! rejected
      const UNPROCESSABLE = 422;
      if (error.status === UNPROCESSABLE) {
        const { errors } = error;
        if (!errors.length) return;
        errors.forEach((err) => {
          methods.setError(err.param, {
            type: 'server',
            message: err.msg,
          });
        });
      }
      setShowAlert(true);
    }
  };

  return (
    <>
      <AlertDismissibleComponent
        variant={auth.success ? 'success' : 'danger'}
        title={auth.success ? 'Đăng nhập thành công' : 'Đăng nhập thất bại'}
        show={showAlert}
        setShow={setShowAlert}
        alwaysShown={true}
      >
        {auth.success ? (
          <div>
            <p>
              Bạn đã đăng nhập thành công tài khoản:{' '}
              <strong>{auth.user?.username}</strong>.
            </p>
          </div>
        ) : (
          <div>
            <p>{auth.message}</p>
          </div>
        )}
      </AlertDismissibleComponent>

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
                  <LoginFormComponent onSubmit={handleSubmit} />
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
