import _ from 'lodash';
import React from 'react';
import { toast } from 'react-toastify';
//! imp Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
//! imp Components
import { Button, Col, Row } from 'react-bootstrap';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import UserFormComponent from '../components/Form/UserFormComponent';
import UserFormPasswordComponent from '../components/Form/UserFormPasswordComponent';
//! imp APIs
import API from '../../../API';
//! imp Actions
import {
  getUserById,
  createUser,
  updateUserInfoById,
  emptyUser,
} from '../UserSlice';

const AddEditUserScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  //! rootState
  const auth = useSelector((state) => state.auth);
  const { user, loading } = useSelector((state) => state.user);

  const isAdmin = user?.roles?.map((role) => role.name).includes('admin');

  const isAdminController = auth?.user?.roles
    ?.map((role) => role.name)
    .includes('admin');

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: 'success',
    title: '',
    message: '',
    button: '',
  });

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  };

  //! effect DidMount
  React.useEffect(() => {
    const load = async () => {
      try {
        if (userId) {
          //! Mode: Edit User
          await loadUser();
        } else {
          //! Mode: Create User
          dispatch(emptyUser());
        }
      } catch (error) {
        handleShowAlert();

        setAlertOpts({
          variant: 'danger',
          title: 'Lỗi hệ thống',
          message:
            error.response?.data?.message ||
            error.response?.message ||
            error.message,
        });
      }
    };

    load();
  }, [userId]);

  async function loadUser() {
    try {
      await dispatch(getUserById(userId)).unwrap();
    } catch (error) {
      throw error;
    }
  }

  const handleInfoSubmit = async (data, event, methods) => {
    const isEqualData = _.isEqual(initialValues, data);

    if (isEqualData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };

    try {
      if (userId) {
        /* MODE: UPDATE / EDIT USER*/
        await dispatch(updateUserInfoById({ userId, userData })).unwrap();
        // await loadUser(); //! Re-load to check initialValues
      } else {
        /* MODE: CREATE NEW USER */
        await dispatch(createUser(userData)).unwrap();
        //! Navigate
      }
      navigate('/admin/users', { replace: true });
    } catch (error) {
      console.log(
        '__Debugger__AddEditUserScreen\n__handleSubmit__error: ',
        error,
        '\n'
      );
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

      handleShowAlert();

      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });
    }
  };

  const handlePasswordSubmit = async (data, event, methods) => {
    const { password, confirmPassword } = data;
    try {
      const response = await API.user.updateUserPassword(user._id, {
        password,
        confirmPassword,
      });

      setAlertOpts({
        variant: 'success',
        title: 'Thay đổi mật khẩu thành công!',
        message: 'Bạn đã thay đổi mật khẩu thành công.',
      });

      setShowAlert(true);
    } catch (error) {
      //! Error Handling
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors?.length) return;
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

      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });

      setShowAlert(true);
      toast.error(error.response.data?.message);
    }
  };

  async function handleClickUpdateRole() {
    try {
      if (!isAdminController) return;

      const response = await API.user.updateRole(userId, 'admin');

      await loadUser();
    } catch (error) {
      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
      });
      setShowAlert(true);
      toast.error(error.response?.message || error.massage);
    }
  }

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

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

  return (
    <div className="screen-main mb-3 mt-md-4">
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      {
        //! Show Notication Alert
      }
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        alwaysShown={true}
      />
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
