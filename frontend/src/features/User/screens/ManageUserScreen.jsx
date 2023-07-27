import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
//! imp Hooks
import { useItemsPerPage } from '../../../hooks/itemsPerPage';
import { useScrollPosition, scrollToTop } from '../../../hooks/scroll';
//! imp Actions
import { getUsersByFilters, clearNotification } from '../UserSlice';
//! imp Services
import userService from '../services/userService';
import { DELETE_USERS, RESET_PASSWORDS } from '../services/actionTypes';
//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import ToolbarSearchComponent from '../components/Toolbars/ToolbarSearchComponent';
import AdminUserCard from '../components/Card/AdminUserCard';
//! imp Comps/Modals
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
//! imp Comps/Button
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';

const ManageUserScreen = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  const itemsPerPage = useItemsPerPage(10, 15, 15, 20);

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-1', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-2',
      label: 'Quản lý Tài khoản',
      path: '/admin/users',
      active: true,
    },
  ];

  // rootState
  const { users, usersCount, user, loading, success, message, error } =
    useSelector((state) => state.user);

  const [actionType, setActionType] = React.useState('');

  //! localState: search/pagination
  const [search, setSearch] = React.useState({ keyword: '', age: '' });
  const [sort, setSort] = React.useState('updatedAt');
  const [order, setOrder] = React.useState(-1);
  const [currentPage, setCurrentPage] = React.useState(1);

  //! localState: selected
  const [selectedIds, setSelectedIds] = React.useState([]);

  //! localState: Modal
  const [showModal, setShowModal] = React.useState(false);
  const [modalOpts, setModalOpts] = React.useState({
    variant: '',
    title: '',
    message: '',
  });
  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: 'success',
    title: '',
    message: '',
    button: '',
  });

  React.useEffect(() => {
    //! effect
    loadUsersByFilters();
  }, [currentPage, itemsPerPage]);

  React.useEffect(() => {
    if (success && message) {
      setAlertOpts({
        variant: 'success',
        title: 'Thông báo',
        message: message,
      });

      handleShowAlert();
    }
    if (success === false && error) {
      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message: error,
      });

      handleShowAlert();
    }
    return () => {
      dispatch(clearNotification());
    };
  }, [success, message, error]);

  const loadUsersByFilters = () => {
    dispatch(
      getUsersByFilters({
        search: search,
        sort: sort,
        order: order,
        page: currentPage,
        perPage: itemsPerPage,
      })
    );
  };

  function handleOpenModal(actionType, ids) {
    setSelectedIds(ids);
    setActionType(actionType);

    const selectedUsers = ids?.map(
      (id) => users.find((user) => user._id === id) //! userObject
    );

    switch (actionType) {
      /* REMOVE USER ACCOUNT */
      case DELETE_USERS:
        //! set Modal style Single or Multiple
        setModalOpts({
          variant: 'danger',
          title: `Xác nhận xóa ${
            selectedUsers.length > 1 ? 'nhiều' : ''
          } tài khoản`,
          message: `Bạn có muốn xóa ${
            selectedUsers.length > 1 ? 'những' : ''
          } tài khoản này không?
          [${selectedUsers[0].email}${
            selectedUsers.length > 1
              ? ', ' + selectedUsers[1].email + '...'
              : ''
          }]
          `,
          nameButton: 'Xác nhận xóa',
        });

        break;
      /* RESET PASSWORD */
      case RESET_PASSWORDS:
        //! set Modal style Single or Multiple
        setModalOpts({
          variant: 'warning',
          title: `Xác nhận Reset password ${
            selectedUsers.length > 1 ? 'nhiều' : ''
          } tài khoản`,
          message: `Bạn có muốn Reset password ${
            selectedUsers.length > 1 ? 'những' : ''
          } tài khoản này không?
          [${selectedUsers[0].email}${
            selectedUsers.length > 1
              ? ', ' + selectedUsers[1].email + '...'
              : ''
          }]
          `,
          nameButton: 'Xác nhận reset password',
        });

        break;

      default:
        //! clearMessage
        break;
    }

    //! show Modal
    handleShowModal();
  }

  const handleSubmit = async () => {
    console.log('handleSubmit');
    try {
      if (actionType === DELETE_USERS) {
        /* REMOVE USER ACCOUNT */
        const response = await userService.deleteUsers(selectedIds);
        const results = response.data.results;
        //! set Alert style
        setAlertOpts({
          variant: 'success',
          title: response.message,
          message: `Bạn đã xóa ${
            results?.length > 1 ? 'nhiều' : ''
          } tài khoản thành công.`,
        });
      } else if (actionType === RESET_PASSWORDS) {
        /* RESET PASSWORD */
        var response = await userService.resetPasswords(selectedIds);
        var results = response.data.results;

        //! set Alert style
        setAlertOpts({
          variant: 'success',
          title: 'Reset password thành công',
          message: `Bạn đã reset password ${
            results?.length > 1 ? 'nhiều' : ''
          } tài khoản thành công.`,
        });
      } else {
        throw new Error('Action not found. Functionality is being improved!');
      }

      handleHideModal();
      handleShowAlert();
      loadUsersByFilters();
      //! gotoTop
      scrollToTop();
    } catch (error) {
      //! Error Handling Slice
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
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      getUsersByFilters({
        sort,
        order,
        page: 1,
        perPage: itemsPerPage,
        search,
      })
    );
  };

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  function handleShowModal() {
    setShowModal(true);
  }

  function handleHideModal() {
    setShowModal(false);
  }

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <AlertDismissibleComponent
        handleHideAlert={handleHideAlert}
        show={showAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        alwaysShown={true}
      />

      <form className="row" onSubmit={handleSearchSubmit}>
        <div className="col-10 col-md-11">
          <ToolbarSearchComponent search={search} setSearch={setSearch} />
        </div>
        <button type="submit" className="btn btn-success col-2 col-md-1">
          Lọc
        </button>
      </form>
      <Row>
        {
          //! Container that in main (App-index.js)
        }
        {users?.length > 0 &&
          users?.map((user) => {
            return (
              <Col key={user._id} xs={6} sm={4} md={4} lg={3}>
                <AdminUserCard user={user} handleOpenModal={handleOpenModal} />
              </Col>
            );
          })}
      </Row>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          currentPage={currentPage}
          itemsCount={usersCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <ConfirmationModalComponent
        showModal={showModal}
        variant={modalOpts.variant}
        title={modalOpts.title}
        nameButton={modalOpts.nameButton}
        message={modalOpts.message}
        handleHideModal={handleHideModal}
        handleSubmit={handleSubmit}
      />
      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default ManageUserScreen;
