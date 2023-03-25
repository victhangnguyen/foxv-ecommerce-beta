import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//! components
import { Button, Card, Col, Row } from 'react-bootstrap';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import SubCategoryFormComponent from '../components/Form/SubCategoryFormComponent';

//! components/icons
import EditRegularIcon from '../../../components/Icon/EditRegularIcon';
import TrashIcon from '../../../components/Icon/TrashIcon';

//! imp Services
import categoryService from '../../Category/services/categoryService';
import subCategoryService from '../services/subCategoryService';

const SubCategoryCreateScreen = () => {
  const auth = useSelector((state) => ({ ...state.auth }));

  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);

  //! search/filter
  const [keyword, setKeyword] = React.useState('');

  //! localState: seleteced
  const [selectedSlug, setSelectedSlug] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState('');

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
      const response = await categoryService.getCategories();
      setLoading(false);
      setCategories(response.data.categories);
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

  const loadSubCategories = async () => {
    try {
      setLoading(true);
      const response = await subCategoryService.getSubCategories();
      setLoading(false);
      setSubCategories(response.data.subCategories);
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

  const loadSubCategoriesByCategoryId = async (categoryId) => {
    try {
      setLoading(true);
      const response = await subCategoryService.getSubCategoriesByCategoryId(
        categoryId
      );
      setLoading(false);
      setSubCategories(response.data.subCategories);
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

  const handleCreateSubCategorySubmit = async (data, e, methods) => {
    const { categoryId, name } = data;
    try {
      setLoading(true);
      const response = await subCategoryService.createSubCategory({
        categoryId,
        name,
      });
      setLoading(false);
      //! clear Form
      methods.reset();
      //! re-load Data
      loadSubCategoriesByCategoryId(categoryId);
      //! show Alert
      setAlertOptions({
        variant: 'success',
        title: 'Tạo Kiểu sản phẩm (SubCategory)',
        message: `Bạn đã tạo Kiểu sản phẩm với tên [${response.data.subCategory.name}] thành công!`,
      });
      setShowAlert(true);
    } catch (error) {
      setLoading(false);
      //! Error Handling
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors.length) return;
        errors.forEach((error) => {
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

  const handleShowModal = (category) => {
    setSelectedSlug(category.slug);
    setShowModal(true);
    setModalOptions({
      variant: 'warning',
      title: 'Xác nhận xóa Kiểu sản phẩm (SubCategory)',
      message: `Bạn có muốn xóa Kiểu sản phẩm với tên [${category.name}] không?`,
      nameButton: 'Xác nhận',
    });
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const triggerSelectChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    try {
      if (categoryId) {
        //! loadSubsByCategoryId
        loadSubCategoriesByCategoryId(categoryId);
      } else {
        //! All
        const response = await subCategoryService.getSubCategories();
        setSubCategories(response.data.subCategories);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleModalSubmit = async () => {
    try {
      setLoading(true);
      const response = await subCategoryService.deleteSubCategoryBySlug(
        selectedSlug
      );
      //! re-load All or base on Category Id
      if (selectedCategoryId) {
        loadSubCategoriesByCategoryId(selectedCategoryId);
      } else {
        loadSubCategories();
      }

      setLoading(false);
      handleHideModal();
      setAlertOptions({
        variant: 'success',
        title: 'Xóa Kiểu sản phẩm (SubCategory)',
        message: `Bạn đã xóa Kiểu sản phẩm với tên [${response.data.subCategory.name}] thành công.`,
      });

      setShowAlert(true);
      toast.success(response.message); //! server response
    } catch (error) {
      setLoading(false);
      handleHideModal();
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

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      <AlertDismissibleComponent
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        show={showAlert}
        setShow={setShowAlert}
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
                      onClick={() => handleShowModal(sub)}
                    >
                      <TrashIcon color="white" size="1.5rem" />
                    </Button>
                    <Link to={`/admin/subcategories/${sub.slug}/update`}>
                      <Button
                        className="btn-sm float-end m-1"
                        variant="warning"
                      >
                        <EditRegularIcon color="white" size="1.5rem" />
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
        handleHideModal={handleHideModal}
        variant={modalOptions.variant}
        title={modalOptions.title}
        message={modalOptions.message}
        handleSubmit={handleModalSubmit}
        nameButton={modalOptions.nameButton}
      />
    </>
  );
};

export default SubCategoryCreateScreen;
