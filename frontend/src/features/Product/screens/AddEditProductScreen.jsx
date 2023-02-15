import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Services
import productService from '../services/productService';
import categoryService from '../../Category/services/categoryService';

//! imp Components
import ToolbarComponent from '../../../components/Toolbars/ToolbarComponent';
import FormProductComponent from '../components/Forms/FormProductComponent';
import AlertDismissibleComponent from '../../../components/Alerts/AlertDismissibleComponent';

const AddEditProductScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState({});
  const [newProduct, setNewProduct] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [showSub, setShowSub] = React.useState(false);
  //! turn on/off Alert
  const [showAlert, setShowAlert] = React.useState(false);

  const [deleteAllProduct, setDeleteAllProduct] = React.useState([]);

  const { productId } = useParams();
  // console.log(
  //   '__Debugger__AddEditProductScreen\n__***__productId: ',
  //   productId
  // );

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
      const productDoc = await productService.getProduct(productId);
      setProduct(productDoc);
      const categoryId = productDoc.category._id;
      if (categoryId) {
        setShowSub(true);
      }
      await loadSubCategories(categoryId);
    } catch (error) {
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

  const handleSubmit = async (productData) => {
    try {
      if (productId) {
        //! Mode: Edit Product
      } else {
        //! Mode: Create Product
        let images = [];
        if (productData.images) images = Array.from(productData.images);

        const newProduct = await productService.createProduct({
          ...productData,
          images,
        });
        setNewProduct(newProduct);
        setShowAlert(true);
        toast.success(`${newProduct.name} đã được tạo!`);
      }
    } catch (error) {
      console.log('Error: ', error);
      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className="screen-main mb-3 mt-md-4">
      {
        //! Show Notication Alert
      }
      {showAlert && (
        <AlertDismissibleComponent
          show={showAlert}
          setShow={setShowAlert}
          title={`Sản phẩm được tạo thành công!`}
        >
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
        </AlertDismissibleComponent>
      )}
      <h2 className="fw-bold mb-2 text-uppercase ">Tạo sản phẩm mới</h2>
      {
        //! FORM SubCategoryFormComponent
      }
      <FormProductComponent
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
