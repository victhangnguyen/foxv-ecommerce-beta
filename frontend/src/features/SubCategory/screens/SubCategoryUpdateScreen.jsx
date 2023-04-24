import _ from 'lodash';
import React from 'react';
import { toast } from 'react-toastify';
//! imp Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import SubCategoryFormComponent from '../components/Form/SubCategoryFormComponent';

//! imp Services
import subCategoryService from '../services/subCategoryService';
import categoryService from '../../Category/services/categoryService';

//! imp Actions
import { getSubCategoryById, updateSubCategoryById } from '../SubCategorySlice';

//! imp APIs
import API from '../../../API';

const SubCategoryUpdateScreen = () => {
  const dispatch = useDispatch();
  const { subCategoryId } = useParams();
  const { subCategory } = useSelector((state) => state.subCategory);

  //! localState: init
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState();

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOptions, setAlertOptions] = React.useState({
    variant: '',
    title: '',
    message: '',
  });

  const initialValues = {
    parent: subCategory?.parent,
    name: subCategory?.name,
    slug: subCategory?.slug,
  };

  React.useEffect(() => {
    loadSubCategoryById(subCategoryId);
  }, [subCategoryId]);

  async function loadSubCategoryById(subCategoryId) {
    try {
      setLoading(true);
      await dispatch(getSubCategoryById(subCategoryId)).unwrap();
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
      toast.error(error.response?.message || error.massage);
    }
  }

  React.useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const response = await API.category.getCategories();
      setLoading(false);
      setCategories(response.data.categories);
    } catch (error) {
      setLoading(false);

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

  async function handleUpdateSubCategorySubmit(data, e, methods) {
    const isEqualData = _.isEqual(initialValues, data);
    if (isEqualData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    console.log(
      '__Debugger__SubCategoryUpdateScreen\n__handleUpdate__data: ',
      data,
      '\n'
    );

    const subCategoryData = {
      parent: data.parent,
      name: data.name,
    };
    try {
      setLoading(true);
      const response = await dispatch(
        updateSubCategoryById({ subCategoryId, subCategoryData })
      ).unwrap();
      console.log('response: ', response);
      setLoading(false);
      handleShowAlert();

      setAlertOptions({
        variant: 'success',
        title: 'Cập nhật Kiểu sản phẩm (Sub Category)',
        message: `Bạn đã cập nhật Kiểu sản phẩm với tên [${response.data.updatedSubCategory.name}] thành công!`,
      });
    } catch (error) {
      console.log(
        '__Debugger__SubCategoryUpdateScreen\n__handleUpdate__error: ',
        error,
        '\n'
      );
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
  }

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

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
      path: `/admin/subcategories/${subCategory}/update`,
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
        subCategoryId={subCategoryId}
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
