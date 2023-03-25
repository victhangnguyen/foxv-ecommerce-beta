import _ from 'lodash';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import SubCategoryFormComponent from '../components/Form/SubCategoryFormComponent';

//! imp Services
import subCategoryService from '../services/subCategoryService';
import categoryService from '../../Category/services/categoryService';

const SubCategoryUpdateScreen = () => {
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
  const [categories, setCategories] = React.useState();
  const [subCategory, setSubCategory] = React.useState({});

  const initialValues = {
    categoryId: subCategory?.parent,
    name: subCategory?.name,
    slug: subCategory?.slug,
  };

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    {
      key: 'breadcrumb-item-1',
      label: 'Quản lý Kiểu',
      path: '/admin/subcategories/create',
    },
    {
      key: 'breadcrumb-item-2',
      label: 'Cập nhật Kiểu sản phẩm',
      path: `/admin/subcategories/${slug}/update`,
      active: true,
    },
  ];

  React.useEffect(() => {
    loadSubCategoryBySlug(slug);
  }, []);

  const loadSubCategoryBySlug = async (slug) => {
    try {
      setLoading(true);
      const response = await subCategoryService.getSubCategoryBySlug(slug);
      setLoading(false);
      setSubCategory(response.data.subCategory);
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

  const handleUpdateSubCategorySubmit = async (data, e, methods) => {
    const isEqualData = _.isEqual(initialValues, data);
    if (isEqualData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    const { categoryId, name } = data;
    try {
      const response = await subCategoryService.updateSubCategoryBySlug(slug, {
        categoryId,
        name,
      });

      toast.success(response.message);
      //! re-load to navigate
      navigate(
        `/admin/subcategories/${response.data.subCategory.slug}/update`,
        {
          replace: true,
        }
      );
      loadSubCategoryBySlug(response.data.subCategory.slug);

      setAlertOptions({
        variant: 'success',
        title: 'Cập nhật Loại sản phẩm (Category)',
        message: `Bạn đã cập nhật Loại sản phẩm với tên [${response.data.subCategory.name}] thành công!`,
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
        Cập nhật Kiểu sản phẩm (SubCategory)
      </h2>
      <p className=" mb-3">
        Điền đầy đủ thông tin để thay đổi Thông tin SubCategory!
      </p>
      {
        //! SubCategoryFormComponent
      }
      <SubCategoryFormComponent
        initialValues={initialValues}
        entitySlug={slug}
        entity={subCategory}
        categories={categories}
        loading={loading}
        handleSubmit={handleUpdateSubCategorySubmit}
      />
      <hr />
    </>
  );
};

export default SubCategoryUpdateScreen;
