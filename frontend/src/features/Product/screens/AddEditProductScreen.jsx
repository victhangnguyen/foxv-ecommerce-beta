import _ from 'lodash';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp API
import API from '../../../API';

//! imp Comps
import AlertDismissibleComponent from '../../../components/Alert/AlertDismissibleComponent';
import BreadcrumbComponent from '../../../components/Breadcrumb/BreadcrumbComponent';
import ProductFormComponent from '../components/Form/ProductFormComponent';

const AddEditProductScreen = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState({});
  const [newProduct, setNewProduct] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [showSub, setShowSub] = React.useState(false);
  //! turn on/off Alert
  const [showAlert, setShowAlert] = React.useState(false);
  const isExistProduct = !_.isEmpty(product);

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
      const productDoc = await API.product.getProduct(productId);
      setLoading(false);
      setProduct(productDoc);
      const categoryId = productDoc.category._id;
      console.log('categoryId: ', categoryId);
      if (categoryId) {
        setShowSub(true);
      }
      await loadSubCategoriesByCategoryId(categoryId);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await API.category.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message);
    }
  };

  const loadSubCategoriesByCategoryId = async (categoryId) => {
    try {
      const response = await API.subCategory.getSubCategoriesByCategoryId(
        categoryId
      );
      setSubCategories(response.data.subCategories);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const triggerSelectCategoryChange = async (e) => {
    const cateogoryId = e.target.value;
    try {
      if (cateogoryId) {
        loadSubCategoriesByCategoryId(cateogoryId);
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
    const isEqualData = _.isEqual(initialValues, data);

    if (isEqualData) {
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
        const updatedProduct = await API.product.updateProduct(
          productId,
          product
        );
        loadProduct();
        setShowAlert(true);
        toast.success(`${updatedProduct.name} đã được cập nhật!`);
        navigate('/admin/products');
      } else {
        //! Mode: Create Product
        const newProduct = await API.product.createProduct(product);
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
        return;
      }

      toast.error(error.response.data?.message);
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
        triggerSelectCategoryChange={triggerSelectCategoryChange}
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
