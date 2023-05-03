import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp API
import API from '../../../API';

//! components
import { Button, Card, Col, Row } from 'react-bootstrap';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import SubCategoryFormComponent from '../components/Form/SubCategoryFormComponent';
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';

//! components/icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//! imp Constants
import constants from '../../../constants';

//! imp Hooks
import { useDispatch, useSelector } from 'react-redux';
import { scrollToTop, useScrollPosition } from '../../../hooks/scroll';

//! imp Services
import categoryService from '../../Category/services/categoryService';
import subCategoryService from '../services/subCategoryService';

//! imp Actions
import {
  getSubCategories,
  getSubCategoriesByCategoryId,
} from '../SubCategorySlice';

const SubCategoryCreateScreen = () => {
  const dispatch = useDispatch();
  const scrollPosition = useScrollPosition();
  //! rootState
  const auth = useSelector((state) => state.auth);
  const { subCategories } = useSelector((state) => state.subCategory);

  //! localState: init
  const [loading, setLoading] = React.useState(false);

  //! search/filter
  const [keyword, setKeyword] = React.useState('');

  //! localState: Select Ids
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState('');

  //! localState: Category Select
  const [categories, setCategories] = React.useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState();
  // const [loading, setLoading] = React.useState(false);

  //! localState: actionType
  const [actionType, setActionType] = React.useState('');

  //! localState Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  //! localState Modal
  const [showModal, setShowModal] = React.useState(false);
  const [modalOpts, setModalOpts] = React.useState({
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
    loadSubCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await API.category.getCategories();
      setLoading(false);
      setCategories(response.data.categories);
    } catch (error) {
      setLoading(false);
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

  const loadSubCategories = async () => {
    try {
      setLoading(true);
      await dispatch(getSubCategories()).unwrap();
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  const loadSubCategoriesByCategoryId = async (categoryId) => {
    try {
      setLoading(true);
      await dispatch(getSubCategoriesByCategoryId(categoryId)).unwrap();
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  const handleCreateSubCategorySubmit = async (data, e, methods) => {
    const { categoryId, name } = data;
    try {
      const response = await subCategoryService.createSubCategory({
        categoryId,
        name,
      });
      //! clear Form
      methods.reset();
      //! re-load Data
      loadSubCategoriesByCategoryId(categoryId);
      //! show Alert
      setAlertOpts({
        variant: 'success',
        title: 'Tạo Kiểu sản phẩm (SubCategory)',
        message: `Bạn đã tạo Kiểu sản phẩm với tên [${response.data.subCategory.name}] thành công!`,
      });
      setShowAlert(true);
    } catch (error) {
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
    }
  };

  const searched = (keword) => (category) =>
    category.name.toLowerCase().includes(keyword);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target?.value?.toLowerCase());
  };

  const handleOpenModal = (actionType, ids) => {
    //! clear Form
    handleHideAlert();

    setActionType(actionType);

    let selectedSubCategories;
    if (_.isArray(ids)) {
      //! multiple Ids
      setSelectedIds(ids);
      selectedSubCategories = ids?.map((id) =>
        subCategories.find((sub) => sub._id === id)
      );
    } else {
      //! single Id
      //! bổ sung: fix lại multiple selectedIds sau khi xóa id single Ids
      setSelectedId(ids);
      selectedSubCategories = [subCategories.find((sub) => sub._id === ids)];
    }

    switch (actionType) {
      /* DELETE ONE CATEOGRY */
      case constants.subCategory.actionTypes.DELETE_SUBCATEGORY:
        setModalOpts({
          variant: 'warning',
          title: `Xác nhận xóa Category`,
          message: `Bạn có muốn xóa Kiểu sản phẩm này không? [Tên Kiểu: ${selectedSubCategories[0]?.name}, Slug: ${selectedSubCategories[0]?.slug}]`,
          nameButton: 'Xác nhận xóa',
        });

        break;

      default:
        setAlertOpts({
          variant: 'danger',
          title: `Hệ thống đang phát triển chức năng`,
          message: `Chức năng này đang được phát triển hoặc nâng cấp. Xin vui lòng xử dụng chức năng này sau!`,
        });

        handleShowAlert();
        return;
    }
    //! Show Confirmation Modal
    handleShowModal();
  };

  const handleConfirmationSubmit = async () => {
    try {
      if (actionType === constants.subCategory.actionTypes.DELETE_SUBCATEGORY) {
        /* REMOVE USER ACCOUNT */
        setLoading(true);
        const response = await API.subCategory.deleteSubCategoryById(
          selectedId
        );
        setLoading(false);

        setAlertOpts({
          variant: response.success ? 'success' : 'danger',
          title: `Xóa Kiểu sản phẩm thành công`,
          message: `Bạn đã xóa Kiểuoại sản phẩm với tên [${response.data.deletedSubCategory.name}] thành công.`,
        });
      }

      //! re-load subCategories (all / by categoryId)
      if (selectedCategoryId) {
        loadSubCategoriesByCategoryId(selectedCategoryId);
      } else {
        loadSubCategories();
      }

      handleHideModal();
      handleShowAlert();
    } catch (error) {
      setLoading(false);
      handleHideModal();
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

  const triggerSelectChange = (e) => {
    setSelectedCategoryId(e.target.value);
    const categoryId = e.target.value;

    if (categoryId) {
      loadSubCategoriesByCategoryId(categoryId);
    } else {
      loadSubCategories();
    }
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

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-1', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-2',
      label: 'Thêm Kiểu sản phẩm',
      path: '/admin/subcategories/create',
      active: true,
    },
  ];

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        alwaysShown={true}
      />

      <h2 className="fw-bold mb-2 text-uppercase ">
        {loading ? 'Loading...' : 'Thêm Kiểu sản phẩm (Subcategory)'}
      </h2>
      <p className=" mb-3">Điền đầy đủ thông tin để tạo Kiểu sản phẩm mới!</p>

      <SubCategoryFormComponent
        loading={loading}
        categories={categories}
        handleSubmit={handleCreateSubCategorySubmit}
        triggerSelectChange={triggerSelectChange}
      />
      <hr />

      <input
        type="search"
        placeholder="Điền Kiểu sản phẩm bạn muốn tìm"
        value={keyword}
        onChange={handleSearchChange}
        aria-label="Search"
        className="form-control me-2"
      />

      <Row>
        {subCategories.filter(searched(keyword)).map((sub) => {
          return (
            <Col md="4" key={sub._id}>
              <Card className="card-category my-1 bg-light">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <strong>{sub.name}</strong>
                  <div className="control">
                    <Button
                      className="btn-sm float-end m-1"
                      variant="danger"
                      onClick={() =>
                        handleOpenModal(
                          constants.subCategory.actionTypes.DELETE_SUBCATEGORY,
                          sub._id
                        )
                      }
                    >
                      <FontAwesomeIcon color="white" icon="fa-solid fa-trash" />
                    </Button>
                    <Link to={`/admin/subcategories/${sub._id}/update`}>
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
        variant={modalOpts.variant}
        title={modalOpts.title}
        nameButton={modalOpts.nameButton}
        message={modalOpts.message}
        handleHideModal={handleHideModal}
        handleSubmit={handleConfirmationSubmit}
      />
      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default SubCategoryCreateScreen;
