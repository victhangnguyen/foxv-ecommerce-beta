import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

//! imp Hooks
import { useItemsPerPage } from '../../../hooks/itemsPerPage';
import { useScroll } from '../../../hooks/scroll';

//! imp Actions
import { fetchUsersByFilters, removeUser } from '../UserSlice';

//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumbs/BreadcrumbComponent';
import ConfirmationModalComponent from '../../../components/Modals/ConfirmationModalComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import ToolbarSearchComponent from '../../../components/Toolbars/ToolbarSearchComponent';
import AdminUserCard from '../components/Cards/AdminUserCard';
//! imp Comps/Modals
import AlertDismissibleComponent from '../../../components/Alerts/AlertDismissibleComponent';
//! imp Comps/Button
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';

const ManageUserScreen = () => {
  const breadcrumbItems = [
    { key: 'breadcrumb-item-1', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-2', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-3',
      label: 'Quản lý Tài khoản',
      path: '/admin/users',
      active: true,
    },
  ];
  const scrollPosition = useScroll();
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
  const [order, setOrder] = React.useState('desc');
  const [currentPage, setCurrentPage] = React.useState(1);

  //! localState: delete Modal
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [modalType, setModalType] = React.useState({
    variant: 'success',
    title: '',
    message: '',
  });
  const [selectedIds, setSelectedIds] = React.useState(null);

  //! localState: Alert
  const [alertType, setAlertType] = React.useState({
    variant: 'success',
    title: '',
    message: '',
    button: '',
  });
  const [showConfirmationAlert, setShowConfirmationAlert] =
    React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  React.useEffect(() => {
    setMessageError(user.error);
  }, [user.error]);

  React.useEffect(() => {
    //! effect
    loadAllUsers();
  }, [currentPage, itemsPerPage]);

  // React.useEffect(() => {
  //   if (user.error) {
  //     setMessageError(user.error);
  //     setShowErrorAlert(true);
  //   }
  // }, [user.error]);

  const loadAllUsers = () => {
    dispatch(
      fetchUsersByFilters({
        search: search,
        sort: sort,
        order: order,
        page: currentPage,
        perPage: itemsPerPage,
      })
    );
  };

  const handleShowModal = (typeAction, ids) => {
    const selectedUsers = user.entities.find((entity) => entity._id === ids);

    setTypeAction(typeAction);
    setSelectedIds(ids);

    switch (typeAction) {
      case 'removeSingleAccount':
        //! set Modal style
        setModalType({
          variant: 'danger',
          title: 'Xác nhận xóa Tài khoản',
          message: `Bạn có muốn xóa tài khoản [${selectedUsers.email}] này không?`,
          nameButton: 'Xác nhận Xóa',
        });
        //! set Alert style
        setAlertType({
          variant: 'success',
          title: 'Xóa tài khoản thành công',
          message: `Bạn đã xóa tài khoản [${selectedUsers.email}] thành công.`,
        });

        break;

      case 'resetPassword':
        //! set Modal style
        setModalType({
          variant: 'warning',
          title: 'Xác nhận Reset Password',
          message: `Bạn có muốn Reset Password tài khoản [${selectedUsers.email}] này không?`,
          nameButton: 'Xác nhận Reset',
        });
        //! set Alert style
        setAlertType({
          variant: 'success',
          title: 'Reset Password thành công',
          message: `Bạn đã Reset Password của tài khoản [${selectedUsers.email}] thành công.`,
        });
        break;

      default:
        //! clearMessage
        break;
    }

    //! show Modal
    setShowConfirmationModal(true);
  };

  const deleteUser = async (userId) => {
    try {
      const deletedUser = await dispatch(removeUser(userId)).unwrap();
      toast.success(`Tài khoản ${deletedUser.email} đã được xóa`);
      //! clearState
      setSelectedIds(null);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  };

  const handleHideModal = () => {
    setShowConfirmationModal(false);
  };

  const handleSubmit = async () => {
    try {
      switch (typeAction) {
        case 'removeSingleAccount':
          await deleteUser(selectedIds);
          break;

        default:
          break;
      }
      loadAllUsers();
      handleHideModal();
      //! show Alert deleted User Infomation
      setShowConfirmationAlert(true);
    } catch (error) {
      setMessageError(error.error);
      setShowErrorAlert(true);
      handleHideModal();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      fetchUsersByFilters({
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
        variant={alertType.variant}
        title={alertType.title}
        show={showConfirmationAlert}
        setShow={setShowConfirmationAlert}
        alwaysShown={false}
      >
        {alertType.message}
      </AlertDismissibleComponent>

      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />

      <form className="toolbar" onSubmit={handleSearchSubmit}>
        <ToolbarSearchComponent search={search} setSearch={setSearch} />
        <button type="submit" className="btn btn-success">
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
        handleHideModal={handleHideModal}
        handleSubmit={handleSubmit}
      />
      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default ManageUserScreen;
