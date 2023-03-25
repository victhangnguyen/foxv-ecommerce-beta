import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
//! imp Hooks
import { useItemsPerPage } from '../../../hooks/itemsPerPage';
import { useScrollPosition, scrollToTop } from '../../../hooks/scroll';
//! imp Actions
import { getUsersByFilters, deleteUsers } from '../UserSlice';
//! imp Services
import userService from '../services/userService';
//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import ToolbarSearchComponent from '../../../components/Toolbars/ToolbarSearchComponent';
import AdminUserCard from '../components/Card/AdminUserCard';
//! imp Comps/Modals
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
//! imp Comps/Button
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';

const ManageUserScreen = () => {
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
  const scrollPosition = useScrollPosition();
  const itemsPerPage = useItemsPerPage(10, 15, 15, 20);

  const dispatch = useDispatch();

  // reduxState
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);

  const [typeAction, setTypeAction] = React.useState('');

  //! localState: message Error
  const [messageError, setMessageError] = React.useState('');

  //! localState: search
  const [search, setSearch] = React.useState({ keyword: '', age: '' });
  const [sort, setSort] = React.useState('createdAt');
  const [order, setOrder] = React.useState(-1);
  const [currentPage, setCurrentPage] = React.useState(1);

  //! localState: delete Modal
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [modalType, setModalType] = React.useState({
    variant: 'success',
    title: '',
    message: '',
  });
  const [selectedIds, setSelectedIds] = React.useState([]);

  //! localState: Alert
  const [alertOptions, setAlertOptions] = React.useState({
    variant: 'success',
    title: '',
    message: '',
    button: '',
  });
  const [showConfirmationAlert, setShowConfirmationAlert] =
    React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  React.useEffect(() => {
    //! effect
    loadAllUsers();
  }, [currentPage, itemsPerPage]);

  const loadAllUsers = () => {
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

  const handleShowModal = (typeAction, ids) => {
    const selectedUsers = ids.map(
      (id) => user.entities.find((entity) => entity._id === id) //! userObject
    );

    setTypeAction(typeAction);

    //! ids: Array
    setSelectedIds(ids);

    switch (typeAction) {
      /* REMOVE USER ACCOUNT */
      case 'deleteUsers':
        //! set Modal style Single or Multiple
        setModalType({
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

        //! set Alert style
        setAlertOptions({
          variant: 'success',
          title: 'Xóa tài khoản thành công',
          message: `Bạn đã xóa ${
            selectedUsers.length > 1 ? 'nhiều' : ''
          } tài khoản thành công.`,
        });

        break;
      /* RESET PASSWORD */
      case 'resetPasswords':
        //! set Modal style Single or Multiple
        setModalType({
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

        //! set Alert style
        setAlertOptions({
          variant: 'success',
          title: 'Reset password thành công',
          message: `Bạn đã reset password ${
            selectedUsers.length > 1 ? 'nhiều' : ''
          } tài khoản thành công.`,
        });
        break;

      default:
        //! clearMessage
        break;
    }

    //! show Modal
    setShowConfirmationModal(true);
  };

  const clearForm = () => {
    setSelectedIds([]);
    setShowConfirmationModal(false);
    setShowErrorAlert(false);
    setShowConfirmationAlert(false);
  };

  const handleHideConfirmationModal = () => setShowConfirmationModal(false);

  const handleSubmit = async () => {
    console.log('handleSubmit');
    try {
      switch (typeAction) {
        /* REMOVE USER ACCOUNT */
        case 'deleteUsers':
          const deletedUser = await dispatch(deleteUsers(selectedIds)).unwrap();

          if (deletedUser.success) {
            toast.success(`Đã xóa tài khoản!`);
          }
          break;

        /* RESET PASSWORD */
        case 'resetPasswords':
          const info = await userService.resetPasswords(selectedIds);
          if (info) {
            toast.success(`Đã reset password tài khoản!`);
          }
          break;

        default:
          throw new Error('Action not found. Functionality is being improved!');
      }
      //! success: True
      //! clear Form
      clearForm();
      loadAllUsers();
      //! gotoTop
      scrollToTop();

      setShowConfirmationAlert(true);
    } catch (error) {
      //! Error Handling Slice
      setMessageError(
        error.error || error.response.data?.message || error.message
      );
      setShowConfirmationModal(false);
      setShowErrorAlert(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      getUsersByFilters({
        search,
        sort,
        order,
        page: 1,
        perPage: itemsPerPage,
      })
    );
  };

  return (
    <>
      <AlertDismissibleComponent
        show={showErrorAlert}
        setShow={setShowErrorAlert}
        variant={'danger'}
        alwaysShown={true}
      >
        {messageError}
      </AlertDismissibleComponent>

      <AlertDismissibleComponent
        variant={alertOptions.variant}
        title={alertOptions.title}
        show={showConfirmationAlert}
        setShow={setShowConfirmationAlert}
        alwaysShown={false}
      >
        {alertOptions.message}
      </AlertDismissibleComponent>

      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />

      <form className="toolbar row" onSubmit={handleSearchSubmit}>
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
        {user.entities?.length > 0 &&
          user.entities?.map((entity) => {
            return (
              <Col key={entity._id} xs={6} sm={4} md={4} lg={3}>
                <AdminUserCard
                  entity={entity}
                  handleShowModal={handleShowModal}
                />
              </Col>
            );
          })}
      </Row>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          currentPage={currentPage}
          itemsCount={user.entitiesCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <ConfirmationModalComponent
        showModal={showConfirmationModal}
        variant={modalType.variant}
        title={modalType.title}
        nameButton={modalType.nameButton}
        message={modalType.message}
        handleHideModal={handleHideConfirmationModal}
        handleSubmit={handleSubmit}
      />
      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default ManageUserScreen;
