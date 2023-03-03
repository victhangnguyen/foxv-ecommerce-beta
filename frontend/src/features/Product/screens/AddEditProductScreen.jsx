import _, { method } from 'lodash';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Utils
import * as errorHandling from '../../../utils/errorHandling';
//! imp Services
import categoryService from '../../Category/services/categoryService';
import productService from '../services/productService';

//! imp Components
import AlertDismissibleComponent from '../../../components/Alerts/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumbs/BreadcrumbComponent';
import ProductFormComponent from '../components/Forms/ProductFormComponent';

const AddEditProductScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState({});
  const [newProduct, setNewProduct] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [showSub, setShowSub] = React.useState(false);
  //! turn on/off Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const isExistProduct = !_.isEmpty(product);

  const { productId } = useParams();

  const breadcrumbItems = [
    { key: 'breadcrumb-item-1', label: 'Home', path: '/' },
    { key: 'breadcrumb-item-2', label: 'Dashboard', path: '/admin' },
    {
      key: 'breadcrumb-item-3',
      label: isExistProduct ? 'Cập nhật Sản phẩm' : 'Thêm mới Sản phẩm',
      path: '/admin/product',
      active: true,
    },
  ];

  const initialValues = {
    name: product.name || '',
    description: product.description || '',
    category: product.category?._id || product.category || '',
    subCategories:
      product.subCategories?.length > 0
        ? product.subCategories.map((sub) => sub._id)
        : [],
    price: product.price || 0,
    shipping: product.shipping || 'no',
    quantity: product.quantity || 0,
    color: product.color || '',
    brand: product.brand || '',
    images: product.images || [],
  };

  //! effect DidMount
  React.useEffect(() => {
    console.log('productId: ', productId);
    loadCategories();
    if (productId) {
      //! Mode: Edit Product
      loadProduct(); //! setProduct with data
    } else {
      //! Mode: Create Product
      setProduct({}); //! setProduct with empty data
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productDoc = await productService.getProduct(productId);
      console.log('productDoc: ', productDoc);
      setLoading(false);
      setProduct(productDoc);
      const categoryId = productDoc.category._id;
      console.log('categoryId: ', categoryId);
      if (categoryId) {
        setShowSub(true);
      }
      await loadSubCategories(categoryId);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  const loadSubCategories = async (categoryId) => {
    try {
      const response = await categoryService.getSubCategoriesByCategoryId(
        categoryId
      );
      setSubCategories(response);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCategoryChange = async (e) => {
    const cateogoryId = e.target.value;
    console.log('__Debugger__handleCategoryChange: ', cateogoryId);
    try {
      if (cateogoryId) {
        loadSubCategories(cateogoryId);
        setShowSub(true);
      } else {
        setShowSub(false);
      }
    } catch (error) {
      console.log('Error: ', error);
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async (data, e, methods) => {
    const isSameData = _.isEqual(initialValues, data);

    if (isSameData) {
      return toast.error('Chưa có thông tin nào thay đổi.');
    }

    const { images } = data;

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
        const updatedProduct = await productService.updateProduct(
          productId,
          product
        );
        loadProduct();
        setShowAlert(true);
        toast.success(`${updatedProduct.name} đã được cập nhật!`);
        navigate('/admin/products');
      } else {
        //! Mode: Create Product
        const newProduct = await productService.createProduct(product);
        //! Error Handling

        // if (response.statusCode > 300) {
        //   setError('root.serverError', {
        //     type: response.statusCode,
        //     message: e.message,
        //     // meta: {}, // something to be consider to included in the phase 2 with meta object
        //   })

        setNewProduct(newProduct);
        setShowAlert(true);
        toast.success(`${newProduct.name} đã được tạo!`);
        navigate('/admin/products');
      }
    } catch (error) {
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
        console.log('errors: ', errors);
      }

      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className="screen-main mb-3 mt-md-4">
      <BreadcrumbComponent breadcrumbItems={breadcrumbItems} />
      {
        //! Show Notication Alert
      }
      {showAlert && (
        <AlertDismissibleComponent
          show={showAlert}
          setShow={setShowAlert}
          title={
            isExistProduct
              ? 'Sản phẩm được cập nhật thành công'
              : 'Sản phẩm được Thêm thành công!'
          }
          variant={_.isEmpty(product) ? 'success' : 'warning'}
        >
          {isExistProduct ? (
            <>
              <p>
                Sản phẩm <strong>{product.name}</strong> có Mã số là{' '}
                <strong>{product._id}</strong>
              </p>
            </>
          ) : (
            <>
              <p>
                Sản phẩm <strong>{newProduct.name}</strong> có Mã số là{' '}
                <strong>{newProduct._id}</strong>
              </p>
              <p>
                Xem chi tiết sản phẩm mới:{' '}
                <Link to={`/admin/product/${newProduct._id}`}>
                  <strong>{newProduct.name}</strong>
                </Link>
              </p>
            </>
          )}
        </AlertDismissibleComponent>
      )}
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
        product={product}
        categories={categories}
        subCategories={subCategories}
        handleCategoryChange={handleCategoryChange}
        showSub={showSub}
        onSubmit={handleSubmit}
      />
      {
        //! Step 2 and Step 3
      }
      {/* <Col md="12">
        <LocalSearchComponent keyword={keyword} setKeyword={setKeyword} />
      </Col> */}
    </div>
  );
};

export default AddEditProductScreen;
