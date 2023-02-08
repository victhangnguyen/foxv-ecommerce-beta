import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

//! imp Services
import productService from '../services/productService';
import categoryService from '../../Category/services/categoryService';

//! imp Components
import FormProductComponent from '../components/Forms/FormProductComponent';

const AddEditProductScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [showSub, setShowSub] = React.useState(false);
  //! turn on/off Alert
  const [showAlert, setShowAlert] = React.useState(false);

  const { productId } = useParams();

  //! effect DidMount
  React.useEffect(() => {
    loadCategories();
    if (productId) {
      //! Mode: Edit Product
      loadProduct();
    }
  }, []);

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
      console.log('__Debugger__screens__AddEditProductScreen__error: ', error);
      toast.error(error.response.data.message);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.log('__Debugger__screens__AddEditProductScreen__error: ', error);
      toast.error(error.response.data.message);
    }
  };

  const loadSubCategories = async (categoryId) => {
    try {
      const response = await categoryService.getSubCategoriesByCategoryId(
        categoryId
      );
      setSubCategories(response);
    } catch (error) {
      console.log('__Debugger__screens__AddEditProductScreen__error: ', error);
      toast.error(error.response.data.message);
    }
  };

  const onSubmit = () => {
    console.log('__Debugger__FormProductComponent__onSubmit');
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
      console.log('__Debugger__screens__AddEditProductScreen__error: ', error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <FormProductComponent
        product={product}
        categories={categories}
        subCategories={subCategories}
        handleCategoryChange={handleCategoryChange}
        showSub={showSub}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AddEditProductScreen;
