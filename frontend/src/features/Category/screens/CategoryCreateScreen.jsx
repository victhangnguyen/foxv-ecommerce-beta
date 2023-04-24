import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import _ from 'lodash';

//! imp Constants
import constants from '../../../constants';

//! imp Hooks
import { useDispatch, useSelector } from 'react-redux';
import { scrollToTop, useScrollPosition } from '../../../hooks/scroll';

//! imp Comps
import { Button, Card, Col, Row } from 'react-bootstrap';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';
import CategoryFormComponent from '../components/Form/CategoryFormComponent';

//! components/icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//! imp Actions
import { getCategories } from '../CategorySlice';

//! imp API
import API from '../../../API';

const CategoryCreateScreen = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  const categorySelector = useSelector((state) => state.category);

  //! rootState
  const auth = useSelector((state) => state.auth);

  const [loading, setLoading] = React.useState(false);

  //! search/filter
  const [keyword, setKeyword] = React.useState('');

  //! localState: Select Ids
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState('');

  //! localState: actionType
  const [actionType, setActionType] = React.useState('');

  //! localState Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  //! localState Modal
  const [showModal, setShowModal] = React.useState(false);
  const [modalOptions, setModalOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
    nameButton: null,
  });

  React.useEffect(() => {
    auth.error && toast.error(auth.error);
  }, [auth.error]);

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      await dispatch(getCategories()).unwrap();
      setLoading(false);
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
    }
  };

  const handleCreateCategorySubmit = async (data, e, methods) => {
    const { name } = data;

    try {
      setLoading(true);
      const response = await API.category.createCategory({ name });
      setLoading(false);
      //! clear Form
      methods.reset();
      //! re-load Data
      loadCategories();
      //! show Alert
      setAlertOptions({
        variant: 'success',
        title: 'Tạo Loại sản phẩm (Category)',
        message: `Bạn đã tạo Loại sản phẩm với tên [${response.data.category.name}] thành công!`,
      });
      setShowAlert(true);
    } catch (error) {
      setLoading(false);
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
    }
  };

  const searched = (keword) => (category) =>
    category.name.toLowerCase().includes(keyword);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target?.value?.toLowerCase());
  };

  function handleOpenModal(actionType, ids) {
    //! clear Form
    handleHideAlert();

    setActionType(actionType);

    let selectedCategories;
    if (_.isArray(ids)) {
      //! multiple Ids
      setSelectedIds(ids);
      selectedCategories = ids?.map((id) =>
        categorySelector.categories.find((order) => order._id === id)
      );
    } else {
      //! single Id
      //! bổ sung: fix lại multiple selectedIds sau khi xóa id single Ids
      setSelectedId(ids);
      selectedCategories = [
        categorySelector.categories.find((cateogry) => cateogry._id === ids),
      ];
    }

    switch (actionType) {
      /* DELETE ONE CATEOGRY */
      case constants.category.actionTypes.DELETE_CATEGORY:
        setModalOptions({
          variant: 'warning',
          title: `Xác nhận xóa Category`,
          message: `Bạn có muốn xóa Loại sản phẩm này không? [Tên Loại: ${selectedCategories[0]?.name}, Slug: ${selectedCategories[0]?.slug}]`,
          nameButton: 'Xác nhận xóa',
        });

        break;

      default:
        setAlertOptions({
          variant: 'danger',
          title: `Hệ thống đang phát triển chức năng`,
          message: `Chức năng này đang được phát triển hoặc nâng cấp. Xin vui lòng xử dụng chức năng này sau!`,
        });

        handleShowAlert();
        return;
    }
    //! Show Confirmation Modal
    handleShowModal();
  }

  async function handleConfirmationSubmit() {
    try {
      setLoading(true);
      const response = await API.category.deleteCategoryById(selectedId);
      setLoading(false);

      loadCategories();
      handleHideModal();
      handleShowAlert();
      setAlertOptions({
        variant: 'success',
        title: 'Xóa Loại sản phẩm (Category)',
        message: `Bạn đã xóa Loại sản phẩm với tên [${response.data?.deletedCategory.name}] thành công.`,
      });
    } catch (error) {
      setLoading(false);
      handleHideModal();
      handleShowAlert();

      setAlertOptions({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });
    }
  }

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

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-1', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-2',
      label: 'Thêm Loại sản phẩm',
      path: '/admin/categories/create',
      active: true,
    },
  ];

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        alwaysShown={true}
      />

      <h2 className="fw-bold mb-2 text-uppercase ">
        {loading ? 'Loading...' : 'Thêm Loại sản phẩm (Category)'}
      </h2>
      <p className=" mb-3">Điền đầy đủ thông tin để tạo Category mới!</p>

      <CategoryFormComponent
        loading={loading}
        handleSubmit={handleCreateCategorySubmit}
      />
      <hr />

      <input
        type="search"
        placeholder="Điền Loại sản phẩm bạn muốn tìm"
        value={keyword}
        onChange={handleSearchChange}
        aria-label="Search"
        className="form-control me-2"
      />

      <Row>
        {categorySelector.categories
          ?.filter(searched(keyword))
          .map((category) => {
            return (
              <Col md="4" key={category._id}>
                <Card className="card-category my-1 bg-light">
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <strong>{category.name}</strong>
                    <div className="control">
                      <Button
                        className="btn-sm float-end m-1"
                        variant="danger"
                        onClick={() =>
                          handleOpenModal(
                            constants.category.actionTypes.DELETE_CATEGORY,
                            category._id
                          )
                        }
                      >
                        <FontAwesomeIcon
                          color="white"
                          icon="fa-solid fa-trash"
                        />
                      </Button>
                      <Link to={`/admin/categories/${category._id}/update`}>
                        <Button
                          className="btn-sm float-end m-1"
                          variant="warning"
                        >
                          <FontAwesomeIcon
                            color="white"
                            icon="fa-solid fa-pen-to-square"
                          />
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
      <ConfirmationModalComponent
        showModal={showModal}
        variant={modalOptions.variant}
        title={modalOptions.title}
        nameButton={modalOptions.nameButton}
        message={modalOptions.message}
        handleHideModal={handleHideModal}
        handleSubmit={handleConfirmationSubmit}
      />
      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default CategoryCreateScreen;
