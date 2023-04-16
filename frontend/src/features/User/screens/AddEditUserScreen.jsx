import _ from 'lodash';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//! imp Services
import userService from '../services/userService';
import authService from '../../Auth/services/authService';
//! imp Components
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import UserFormComponent from '../components/Form/UserFormComponent';
import UserFormPasswordComponent from '../components/Form/UserFormPasswordComponent';
//! imp Actions

const AddEditUserScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  //! rootState
  const auth = useSelector((state) => state.auth);
  const isAdminController = auth.user?.roles
    ?.map((role) => role.name)
    .includes('admin');

  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({});

  const isAdmin = user.roles?.map((role) => role.name).includes('admin');
  //! role? -> ok

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  const isExistUser = !_.isEmpty(user);

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    {
      key: 'breadcrumb-item-1',
      label: 'Quản lý Tài khoản',
      path: '/admin/users',
    },
    {
      key: 'breadcrumb-item-2',
      label: isExistUser ? 'Cập nhật Tài khoản' : 'Thêm mới Tài khoản',
      path: isExistUser
        ? `/admin/users/${userId}/update`
        : `/admin/users/create`,
      active: true,
    },
  ];

  const initialValues = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
  };

  //! effect DidMount
  React.useEffect(() => {
    if (userId) {
      //! Mode: Edit User
      loadUser(); //! setUser with data
    } else {
      //! Mode: Create User
      setUser({}); //! setUser with empty data
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userDoc = await userService.getUser(userId);
      setLoading(false);
      setUser(userDoc?.data.user);
    } catch (error) {
      setLoading(false);
      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });
      setShowAlert(true);
      toast.error(error.response?.message || error.massage);
    }
  };

  const handleInfoSubmit = async (data, event, methods) => {
    const isEqualData = _.isEqual(initialValues, data);

    if (isEqualData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    const { firstName, lastName, username, email, phoneNumber } = data;

    try {
      if (userId) {
        //! Mode: Edit User Account
        const response = await userService.updateUserInfo(userId, {
          firstName,
          lastName,
          username,
          email,
          phoneNumber,
        });

        //! reload User
        await loadUser();

        setAlertOptions({
          variant: 'success',
          title: 'Thay đổi thông tin thành công!',
          message: 'Bạn đã thay đổi thông tin thành công.',
        });

        setShowAlert(true);
      } else {
        //! Mode: Create New User
        const response = await authService.signup({
          firstName,
          lastName,
          username,
          email,
          phoneNumber,
        });
        //! OPTION: Navigate

        navigate('/admin/users', { replace: true });
        toast.success(
          `Đăng ký tài khoản thành công. [username: ${response.data.user.username}]`
        );

        //! OPTION: No navigate
        /*

        //! reset Form
        methods.reset();

        setAlertOptions({
          variant: 'success',
          title: `Đăng ký tài khoản thành công. [username: ${response.data.user.username}]`,
          message: 'Bạn đã đăng ký tài khoản thành công.',
        });

        setShowAlert(true);

        */
      }
    } catch (error) {
      //! Error Handling
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors.length) return;
        errors.forEach((error) => {
          if (error.param === 'subCategories') {
            if (!data.category) return;
          }
          methods.setError(error.param, {
            type: 'server',
            message: error.msg,
          });
        });

        // return;
      }
      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });

      setShowAlert(true);
    }
  };

  const handlePasswordSubmit = async (data, event, methods) => {
    const { password, confirmPassword } = data;
    try {
      const response = await userService.updateUserPassword(user._id, {
        password,
        confirmPassword,
      });

      setAlertOptions({
        variant: 'success',
        title: 'Thay đổi mật khẩu thành công!',
        message: 'Bạn đã thay đổi mật khẩu thành công.',
      });

      setShowAlert(true);
    } catch (error) {
      //! Error Handling
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors.length) return;
        errors.forEach((error) => {
          if (error.param === 'subCategories') {
            if (!data.category) return;
          }
          methods.setError(error.param, {
            type: 'server',
            message: error.msg,
          });
        });
        return;
      }

      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });

      setShowAlert(true);
      toast.error(error.response.data?.message);
    }
  };

  async function handleClickUpdateRole() {
    try {
      if (!isAdminController) return;

      const response = await userService.updateRole(userId, 'admin');

      await loadUser();
    } catch (error) {
      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });
      setShowAlert(true);
      toast.error(error.response?.message || error.massage);
    }
  }

  return (
    <div className="screen-main mb-3 mt-md-4">
      <AlertDismissibleComponent
        show={showAlert}
        setShow={setShowAlert}
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        alwaysShown={true}
      />
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <h2 className="fw-bold mb-2 text-uppercase ">
        {loading
          ? 'Loading...'
          : isExistUser
          ? 'Cập nhật tài khoản'
          : 'Thêm tài khoản mới'}
      </h2>
      {
        //! FORM SubCategoryFormComponent
      }
      <Row>
        <Col md={8} lg={6}>
          <UserFormComponent
            initialValues={initialValues}
            user={user}
            onSubmit={handleInfoSubmit}
          />
          {userId && (
            <>
              <hr />
              <h2>Bảo mật - Thay đổi mật khẩu</h2>
              <UserFormPasswordComponent onSubmit={handlePasswordSubmit} />
            </>
          )}
        </Col>
        {isAdminController && userId && (
          <Col md={{ span: 3, offset: 1 }} lg={{ span: 5, offset: 1 }}>
            <span className="me-2">
              {isAdmin ? 'Admin đang được bật' : 'Admin đang bị tắt'}
            </span>
            <Button
              variant={isAdmin ? 'danger' : 'success'}
              onClick={handleClickUpdateRole}
            >
              {isAdmin ? 'Tắt' : 'Bật'}
            </Button>
          </Col>
        )}
      </Row>

      {/* <Col md="12">
        <LocalSearchComponent keyword={keyword} setKeyword={setKeyword} />
      </Col> */}
    </div>
  );
};

export default AddEditUserScreen;
