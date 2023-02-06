import React from 'react';

//! imp Components
import ProductFormComponent from '../components/Forms/ProductFormComponent';

const AddEditProductScreen = () => {

  const onSubmit = () => {
    console.log('__Debugger__ProductFormComponent__onSubmit');
  };

  return (
    <div>
      <ProductFormComponent onSubmit={onSubmit} />
    </div>
  );
};

export default AddEditProductScreen;
