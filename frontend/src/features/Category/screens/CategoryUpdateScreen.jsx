import _ from 'lodash';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import CategoryFormComponent from '../components/Form/CategoryFormComponent';

//! imp Services
import categoryService from '../services/categoryService';

const CategoryUpdateScreen = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  //! localState: Category
  const [loading, setLoading] = React.useState(false);
  const [category, setCategory] = React.useState({});

  const initialValues = {
    name: category?.name,
    slug: category?.slug,
  };

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    {
      key: 'breadcrumb-item-1',
      label: 'Quản lý Loại',
      path: '/admin/categories/create',
    },
    {
      key: 'breadcrumb-item-2',
      label: 'Cập nhật Loại sản phẩm',
      path: `/admin/categories/${slug}/update`,
      active: true,
    },
  ];

  React.useEffect(() => {
    loadCategoryBySlug(slug);
  }, []);

  const loadCategoryBySlug = async (slug) => {
    try {
      setLoading(true);
      const response = await categoryService.getCateogryBySlug(slug);
      setLoading(false);
      setCategory(response.data.category);
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

  const handleUpdateCategorySubmit = async (data, e, methods) => {
    const isEqualData = _.isEqual(initialValues, data);
    if (isEqualData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    const { name } = data;
    try {
      const response = await categoryService.updateCategoryBySlug(slug, {
        name,
      });
      toast.success(response.message);
      //! re-load to navigate
      navigate(`/admin/categories/${response.data.category.slug}/update`, {
        replace: true,
      });
      loadCategoryBySlug(response.data.category.slug);

      setAlertOptions({
        variant: 'success',
        title: 'Cập nhật Loại sản phẩm (Category)',
        message: `Bạn đã cập nhật Loại sản phẩm với tên [${response.data.category.name}] thành công!`,
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

  return (
    <>
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />

      <AlertDismissibleComponent
        show={showAlert}
        setShow={setShowAlert}
        variant={alertOptions.variant}
        title={alertOptions.title}
        message={alertOptions.message}
        alwaysShown={true}
      />
      <h2 className="fw-bold mb-2 text-uppercase ">
        Cập nhật Loại sản phẩm (Category)
      </h2>
      <p className=" mb-3">
        Điền đầy đủ thông tin để thay đổi Thông tin SubCategory!
      </p>
      {
        //! CategoryFormComponent
      }
      <CategoryFormComponent
        entitySlug={slug}
        loading={loading}
        initialValues={initialValues}
        handleSubmit={handleUpdateCategorySubmit}
      />

      <hr />
    </>
  );
};

export default CategoryUpdateScreen;
