import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

//! imp Hooks
import { useWindowSize } from '../../../hooks/windowSize';
import { useItemsPerPage } from '../../../hooks/itemsPerPage';

//! imp Actions
import { fetchUsersByFilters, removeUser } from '../UserSlice';

//! imp Comps
import BreadcrumbComponent from '../../../components/Breadcrumbs/BreadcrumbComponent';
import PaginationComponent from '../../../components/Pagination/PaginationComponent';
import ToolbarSearchComponent from '../../../components/Toolbars/ToolbarSearchComponent';
import AdminUserCard from '../components/Cards/AdminUserCard';
import DeleteConfirmationModalComponent from '../../../components/Modals/DeleteConfirmationModalComponent';
//! imp Comps/Modals
import AlertDismissibleComponent from '../../../components/Alerts/AlertDismissibleComponent';

const ManageUserScreen = () => {
  const itemsPerPage = useItemsPerPage(10, 15, 15, 20) || 10;
  const dispatch = useDispatch();

  //! localState: search
  const [search, setSearch] = React.useState({ keyword: '', age: '' });
  const [sort, setSort] = React.useState('createdAt');
  const [order, setOrder] = React.useState('desc');
  const [currentPage, setCurrentPage] = React.useState(1);

  const user = useSelector((state) => state.user);
  console.log('userSlice: ', user);

  //! localState: delete Modal
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState(null);
  const [deleteMessage, setDeleteMessage] = React.useState('');
  const [singleDeleteMesssage, setSingleDeleteMesssage] = React.useState('');

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  // React.useEffect(() => {
  //   //! effect
  //   loadAllUsers(search, sort, order, currentPage, REACT_PER_PAGE);
  // }, []);

  React.useEffect(() => {
    //! effect
    loadAllUsers();
  }, [currentPage, itemsPerPage]);

  React.useEffect(() => {
    if (user.error) {
      setShowErrorAlert(true);
    }
  }, [user.error]);

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

  //! DeleteConfirmationModal
  const handleShowDeleteModal = (type, ids) => {
    setSelectedIds(ids);

    if (type === 'single') {
      const nameUser = user.entities.find((entity) => entity._id === ids).name;
      setDeleteMessage(
        // fruits.find((x) => x.id === id).name
        `Bạn có muốn xóa tài khoản [${nameUser}] này không?`
      );
      setSingleDeleteMesssage(
        // fruits.find((x) => x.id === id).name
        `Bạn đã xóa tài khoản [${nameUser}] thành công.`
      );

      //! show Modal
      setShowConfirmationModal(true);
    }
  };

  const handleSearch = () => {
    loadAllUsers();
  };

  const breadcrumbItems = [
    { key: 'breadcrumb-item-1', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-2', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-3',
      label: 'Quản lý Tài khoản',
      path: '/admin/products',
      active: true,
    },
  ];

  const deleteUser = async (userId) => {
    const deletedUser = await dispatch(removeUser(userId)).unwrap();
    toast.success(`Tài khoản ${deletedUser.name} đã được xóa`);
    //! clearState
    setSelectedIds(null);
    return deletedUser;
  };

  const handleHideModal = () => {
    setShowConfirmationModal(false);
  };

  const handleSubmitDelete = async () => {
    await deleteUser(selectedIds);
    loadAllUsers();
    handleHideModal();
    //! show Alert deleted User Infomation
    setShowAlert(true);
  };

  const handleSubmit = (e) => {
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
        {user.error}
      </AlertDismissibleComponent>
      <AlertDismissibleComponent
        show={showAlert}
        setShow={setShowAlert}
        variant="success"
        alwaysShown={false}
      >
        {singleDeleteMesssage}
      </AlertDismissibleComponent>

      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <form className="toolbar" onSubmit={handleSubmit}>
        <ToolbarSearchComponent search={search} setSearch={setSearch} />
        <Button onClick={handleSearch}>Lọc</Button>
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
                  handleShowDeleteModal={handleShowDeleteModal}
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
      <DeleteConfirmationModalComponent
        title={'Xác nhận xóa tài khoản'}
        showModal={showConfirmationModal}
        message={deleteMessage}
        handleHideModal={handleHideModal}
        handleSubmitDelete={handleSubmitDelete}
      />
    </>
  );
};

export default ManageUserScreen;
