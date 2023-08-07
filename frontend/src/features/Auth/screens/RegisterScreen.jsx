import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
//! Hooks
import { useDispatch, useSelector } from "react-redux";
import { scrollToTop } from "../../../hooks/scroll";

//! imp Actions
import { signup } from "../AuthSlice";

//! imp Comps
import AlertDismissibleComponent from "../../../components/Alert/AlertDismissibleComponent";
import RegisterFormComponent from "../components/RegisterFormComponent";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: "",
    title: "",
    message: "",
  });

  const handleSignupSubmit = async (data, e, methods) => {
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

      if (response.success) {
        //! make Form clear
        methods.reset();
        //! goto Top
        scrollToTop();

        setAlertOpts({
          variant: "success",
          title: "Đăng ký tài khoản thành công",
          message: `Bạn đã đăng ký thành công tài khoản [${response.data.user.email}].`,
        });
        setShowAlert(true);
      }
    } catch (error) {
      //! Error Handling
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors?.length) return;
        errors.forEach((error) => {
          methods.setError(error.param, {
            type: "server",
            message: error.msg,
          });
        });

        return;
      }

      setAlertOpts({
        variant: "danger",
        title: "Lỗi hệ thống",
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
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
                  <RegisterFormComponent
                    loading={auth?.loading}
                    onSubmit={handleSignupSubmit}
                  />
                </div>
                <div className="mt-3">
                  <p className="mb-0  text-center">
                    Bạn đã có tài khoản?{" "}
                    <Link to={"/auth/login"} className="text-primary fw-bold">
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
