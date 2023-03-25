import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//! components
import { Button, Card, Col, Row } from 'react-bootstrap';
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ConfirmationModalComponent from '../../../components/Modal/ConfirmationModalComponent';
import CategoryFormComponent from '../components/Form/CategoryFormComponent';

//! components/icons
import EditRegularIcon from '../../../components/Icon/EditRegularIcon';
import TrashIcon from '../../../components/Icon/TrashIcon';

//! imp Services
import categoryService from '../services/categoryService';

const CategoryCreateScreen = () => {
  const auth = useSelector((state) => ({ ...state.auth }));

  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);

  //! search/filter
  const [keyword, setKeyword] = React.useState('');

  //! localState: seleteced
  const [selectedSlug, setSelectedSlug] = React.useState('');

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
      label: 'Thêm Loại sản phẩm',
      path: '/admin/categories/create',
      active: true,
    },
  ];

  React.useEffect(() => {
    auth.error && toast.error(auth.error);
  }, [auth.error]);

  React.useEffect(() => {
    loadCategories();
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

  const handleCreateCategorySubmit = async (data, e, methods) => {
    const { name } = data;
    try {
      setLoading(true);
      const response = await categoryService.createCategory({ name });
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

  const handleShowModal = (category) => {
    setSelectedSlug(category.slug);
    setShowModal(true);
    setModalOptions({
      variant: 'warning',
      title: 'Xác nhận xóa Loại (Category)',
      message: `Bạn có muốn xóa Loại sản phẩm với tên [${category.name}] không?`,
      nameButton: 'Xác nhận',
    });
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleModalSubmit = async () => {
    try {
      setLoading(true);
      const response = await categoryService.deleteCategoryBySlug(selectedSlug);
      loadCategories();
      setLoading(false);
      handleHideModal();
      setAlertOptions({
        variant: 'success',
        title: 'Xóa Loại sản phẩm (Category)',
        message: `Bạn đã xóa Loại sản phẩm với tên [${response.data.category.name}] thành công.`,
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
      toast.error(error.response?.message);
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
        {categories.filter(searched(keyword)).map((category) => {
          return (
            <Col md="4" key={category._id}>
              <Card className="card-category my-1 bg-light">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <strong>{category.name}</strong>
                  <div className="control">
                    <Button
                      className="btn-sm float-end m-1"
                      variant="danger"
                      onClick={() => handleShowModal(category)}
                    >
                      <TrashIcon color="white" size="1.5rem" />
                    </Button>
                    <Link to={`/admin/categories/${category.slug}/update`}>
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

export default CategoryCreateScreen;
