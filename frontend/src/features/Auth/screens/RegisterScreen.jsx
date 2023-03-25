import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Actions
import { signup } from '../AuthSlice';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import RegisterFormComponent from '../components/RegisterFormComponent';

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [newUser, setNewUser] = React.useState({});

  //! localState Alert
  const [showAlert, setShowAlert] = React.useState(false);

  const handleSubmit = async (data, e, methods) => {
    console.log('handleSubmnit-data: ', data);
    const {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = data;
    try {
      const response = await dispatch(
        signup({
          firstName,
          lastName,
          username,
          email,
          phoneNumber,
          password,
          confirmPassword, //! send to check Password must be match
        })
      ).unwrap();
      //! fulfilled
      setNewUser(response.data.user);
      toast.success(response.message);
      setShowAlert(true);
    } catch (error) {
      toast.error(auth.message);

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
    }
  };

  return (
    <>
      <AlertDismissibleComponent
        variant={auth.success ? 'success' : 'danger'}
        title={auth.success ? 'Đăng ký thành công' : 'Đăng ký thất bại'}
        show={showAlert}
        setShow={setShowAlert}
        alwaysShown={true}
      >
        {auth.success ? (
          <div>
            <p>
              Bạn đã đăng ký thành công tài khoản:{' '}
              <strong>{newUser.username}</strong>.
            </p>
            <p>
              Truy cập email: <strong>{newUser.email}</strong> để xác nhận
              password.
            </p>
          </div>
        ) : (
          'Bạn đã đăng ký tài khoản thất bại.'
        )}
      </AlertDismissibleComponent>

      <Row className="mb-4 d-flex justify-content-center align-items-center">
        <Col xs={12} sm={8} md={8} lg={6} xl={4}>
          <Card className="card-main shadow overflow-hidden">
            <div className="card-line-top"></div>
            <Card.Body className="px-3 px-md-5">
              <div className="mb-3 mt-md-4">
                <h2 className="fw-bold mb-2 text-uppercase ">
                  Đăng ký tài khoản
                </h2>
                <p className=" mb-2">
                  Đăng ký để tích điểm và hưởng ưu đãi thành viên khi mua hàng.
                  Nhập Email để đăng ký thành viên FOXV.
                </p>
                {
                  //! RegisterFormComponent
                }
                <div className="my-4">
                  <RegisterFormComponent onSubmit={handleSubmit} />
                </div>
                <div className="mt-3">
                  <p className="mb-0  text-center">
                    Bạn đã có tài khoản?{' '}
                    <Link to={'/auth/login'} className="text-primary fw-bold">
                      Đăng nhập
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

export default RegisterScreen;
