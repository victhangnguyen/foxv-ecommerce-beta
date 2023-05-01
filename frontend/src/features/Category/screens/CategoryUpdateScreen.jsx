import _ from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import CategoryFormComponent from '../components/Form/CategoryFormComponent';

import {
  emptyCategory,
  getCategoryById,
  updateCategoryById,
} from '../CategorySlice';

const CategoryUpdateScreen = () => {
  const dispatch = useDispatch();
  const categorySelector = useSelector((state) => state.category);

  const { categoryId } = useParams();

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  const initialValues = {
    name: categorySelector.category?.name,
    slug: categorySelector.category?.slug,
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
      path: `/admin/categories/${categoryId}/update`,
      active: true,
    },
  ];

  React.useEffect(() => {
    loadCategory();

    return () => {
      dispatch(emptyCategory());
    };
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      await dispatch(getCategoryById(categoryId)).unwrap();
    } catch (error) {
      dispatch(emptyCategory());

      handleShowAlert();
      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });
    }
  };

  const handleUpdateCategorySubmit = async (data, e, methods) => {
    const isEqualData = _.isEqual(initialValues, data);
    if (isEqualData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    const { name } = data;
    try {
      const response = await dispatch(
        updateCategoryById({ categoryId, categoryData: { name } })
      ).unwrap();

      handleShowAlert();
      setAlertOpts({
        variant: 'success',
        title: 'Cập nhật Loại sản phẩm (Category)',
        message: `Bạn đã cập nhật Loại sản phẩm với tên [${response.data.updatedCategory.name}] thành công!`,
      });
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

      handleShowAlert();

      setAlertOpts({
        variant: 'danger',
        title: 'Lỗi hệ thống',
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message,
      });
    }
  };

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

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
        Cập nhật Loại sản phẩm (Category)
      </h2>
      <p className=" mb-3">
        Điền đầy đủ thông tin để thay đổi Thông tin SubCategory!
      </p>
      {
        //! CategoryFormComponent
      }
      <CategoryFormComponent
        categoryId={categoryId}
        loading={categorySelector.loading}
        initialValues={initialValues}
        handleSubmit={handleUpdateCategorySubmit}
      />

      <hr />
    </>
  );
};

export default CategoryUpdateScreen;
