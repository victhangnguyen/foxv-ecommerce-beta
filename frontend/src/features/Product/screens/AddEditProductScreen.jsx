import _ from 'lodash';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//! imp Hooks
import { useDispatch, useSelector } from 'react-redux';

//! imp Actions
import { getProductById, emptyProduct } from '../ProductSlice';

//! imp APIs
import API from '../../../API';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ProductFormComponent from '../components/Form/ProductFormComponent';

const AddEditProductScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { product } = useSelector((state) => state.product);

  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [showSub, setShowSub] = React.useState(false);

  //! localState: Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertOpts, setAlertOpts] = React.useState({
    variant: 'success',
    title: '',
    message: '',
    button: '',
  });

  const isExistProduct = !_.isEmpty(product);

  const initialValues = {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category?._id || '',
    subCategories:
      product?.subCategories?.length > 0
        ? product.subCategories.map((sub) => sub._id)
        : [],
    price: product?.price || 0,
    shipping: product?.shipping || '',
    quantity: product?.quantity || 0,
    color: product?.color,
    brand: product?.brand,
    images: product?.images || [],
  };

  React.useEffect(() => {
    const load = async () => {
      try {
        if (productId) {
          handleShowSub();
          await loadProduct(); //! setProduct with data

          if (product?.category?._id) {
            await loadSubCategoriesByCategoryId(product.category._id);
          }
          //! Mode: Update/Edit Product
        }

        loadCategories();
      } catch (error) {
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

    load();

    return () => {
      dispatch(emptyProduct());
    };
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);
      await dispatch(getProductById(productId)).unwrap();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  async function loadCategories() {
    try {
      setLoading(true);
      const response = await API.category.getCategories();
      setLoading(false);
      setCategories(response.data.categories);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  async function triggerSelectCategoryChange(e, methods) {
    const cateogoryId = e.target.value;
    methods.setValue('subCategories', []);
    try {
      if (cateogoryId) {
        handleShowSub();
        loadSubCategoriesByCategoryId(cateogoryId);
      } else {
        handleHideSub();
      }
    } catch (error) {
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
  }

  const handleSubmit = async (data, e, methods) => {
    console.log('__AddEditProductScreen__handleSubmit: ', data);
    const isEqualData = _.isEqual(initialValues, data);

    if (isEqualData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    const { images } = data;
    console.log(
      '__Debugger__AddEditProductScreen\n__handleSubmit__images: ',
      images,
      '\n'
    );

    try {
      //! Neu thay doi Image => FileList
      //! Khong thay doi Image => Empty Array
      let imagesData = [];

      //! FileList
      if (!Array.isArray(images)) {
        imagesData = Array.from(images);
      }

      const product = {
        ...data,
        images: imagesData,
      };

      if (productId) {
        //! Mode: Edit Product
        const updatedProduct = await API.product.updateProductById(
          productId,
          product
        );
        loadProduct();
        setShowAlert(true);
        toast.success(`${updatedProduct.name} đã được cập nhật!`);
        navigate('/admin/products');
      } else {
        //! Mode: Create Product
        console.log(
          '__Debugger__AddEditProductScreen\n__createProdcut__product: ',
          product,
          '\n'
        );
        const newProduct = await API.product.createProduct(product);
        //! Error Handling

        // if (response.statusCode > 300) {
        //   setError('root.serverError', {
        //     type: response.statusCode,
        //     message: e.message,
        //     // meta: {}, // something to be consider to included in the phase 2 with meta object
        //   })

        setShowAlert(true);
        toast.success(`${newProduct.name} đã được tạo!`);
        navigate('/admin/products');
      }
    } catch (error) {
      //! Error Handling
      console.log(
        '__Debugger__AddEditProductScreen\n__error__error: ',
        error,
        '\n'
      );
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (!errors?.length) return;
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

  async function loadSubCategoriesByCategoryId(categoryId) {
    try {
      const response = await API.subCategory.getSubCategoriesByCategoryId(
        categoryId
      );
      setSubCategories(response.data.subCategories);
    } catch (error) {
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
  }

  function handleShowAlert() {
    setShowAlert(true);
  }

  function handleHideAlert() {
    setShowAlert(false);
  }

  function handleShowSub() {
    setShowSub(true);
  }

  function handleHideSub() {
    setShowSub(false);
  }

  const breadcrumbItems = [
    { key: 'breadcrumb-item-0', label: 'Home', path: '/' },
    {
      key: 'breadcrumb-item-1',
      label: 'Quản lý Sản phẩm',
      path: '/admin/products',
    },
    {
      key: 'breadcrumb-item-2',
      label: isExistProduct ? 'Cập nhật Sản phẩm' : 'Thêm mới Sản phẩm',
      path: isExistProduct
        ? `/admin/products/${productId}/update`
        : `/admin/products/create`,
      active: true,
    },
  ];

  return (
    <div className="screen-main mb-3 mt-md-4">
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      {
        //! Show Notication Alert
      }
      <AlertDismissibleComponent
        show={showAlert}
        handleHideAlert={handleHideAlert}
        variant={alertOpts.variant}
        title={alertOpts.title}
        message={alertOpts.message}
        alwaysShown={true}
      />
      <h2 className="fw-bold mb-2 text-uppercase ">
        {loading
          ? 'Loading...'
          : isExistProduct
          ? 'Cập nhật sản phẩm'
          : 'Thêm sản phẩm mới'}
      </h2>
      {
        //! FORM SubCategoryFormComponent
      }
      <ProductFormComponent
        initialValues={initialValues}
        productId={productId}
        categories={categories}
        subCategories={subCategories}
        triggerSelectCategoryChange={triggerSelectCategoryChange}
        showSub={showSub}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddEditProductScreen;

// {showAlert && (
//   <AlertDismissibleComponent
//     show={showAlert}
//     setShow={setShowAlert}
//     title={
//       isExistProduct
//         ? 'Sản phẩm được cập nhật thành công'
//         : 'Sản phẩm được Thêm thành công!'
//     }
//     variant={_.isEmpty(product) ? 'success' : 'warning'}
//   >
//     {isExistProduct ? (
//       <>
//         <p>
//           Sản phẩm <strong>{product.name}</strong> có Mã số là{' '}
//           <strong>{product._id}</strong>
//         </p>
//       </>
//     ) : (
//       <>
//         <p>
//           Sản phẩm <strong>{newProduct.name}</strong> có Mã số là{' '}
//           <strong>{newProduct._id}</strong>
//         </p>
//         <p>
//           Xem chi tiết sản phẩm mới:{' '}
//           <Link to={`/admin/product/${newProduct._id}`}>
//             <strong>{newProduct.name}</strong>
//           </Link>
//         </p>
//       </>
//     )}
//   </AlertDismissibleComponent>
// )}
