import React from 'react';
import * as yup from 'yup';
//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../../components/Form/FormComponent';
import InputComponent from '../../../../components/Form/InputComponent';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Ít nhất 2 ký tự.')
    .max(32, 'Nhiều nhất 32 ký tự.')
    .required('Vui lòng nhập Category.'),
});

const CategoryFormComponent = ({
  entitySlug,
  loading,
  handleSubmit,
  initialValues,
}) => {
  return (
    <FormComponent
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {
        //! name
      }
      <InputComponent
        name={'name'}
        label={'Loại sản phẩm'}
        placeholder={'Nhập Loại sản phẩm (Category)'}
      />
      {
        //! slug
      }
      {entitySlug && (
        <InputComponent
          disabled={true}
          name={'slug'}
          label={'Slug category'}
          placeholder={'Slug của Category'}
        />
      )}
      {
        //! Submit
      }
      <div>
        <Button variant="primary" type="submit">
          {loading ? 'Loading...' : entitySlug ? 'Cập nhật' : 'Tạo ngay'}
        </Button>
      </div>
    </FormComponent>
  );
};

export default CategoryFormComponent;
