import React from 'react';
import * as yup from 'yup';
//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../../components/Form/FormComponent';
import SelectControllerComponent from '../../../../components/Form/SelectControllerComponent';
import InputComponent from '../../../../components/Form/InputComponent';

const validationSchema = yup.object({
  parent: yup.string().required('Xin vui lòng chọn Kiểu sản phẩm.'),
  name: yup
    .string()
    .min(2, 'Ít nhất 2 ký tự.')
    .max(32, 'Nhiều nhất 32 ký tự.')
    .required('Vui lòng nhập Kiểu sản phẩm.'),
});

const SubCategoryFormComponent = ({
  subCategoryId,
  categories,
  loading,
  handleSubmit,
  triggerSelectChange,
  initialValues,
}) => {
  const categoryOptions = categories?.map((category) => ({
    key: category._id,
    value: category._id,
    label: category.name,
  }));
  return (
    <FormComponent
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {
        //! cate: categoryId
      }
      <SelectControllerComponent
        triggerSelectChange={triggerSelectChange}
        name={'parent'}
        label={'Loại sản phẩm (CategoryId)'}
        optionLabel={'Vui lòng chọn Kiểu sản phẩm'}
        options={categoryOptions}
        className={'mb-3 form-group-cateogry'}
      />
      {
        //! sub: name
      }
      <InputComponent
        name={'name'}
        label={'Kiểu sản phẩm'}
        placeholder={'Nhập Kiểu sản phẩm (SubCategory)'}
      />
      {
        //! sub: slug
      }
      {subCategoryId && (
        <InputComponent
          disabled={true}
          name={'slug'}
          label={'Slug SubCategory'}
          placeholder={'Slug của SubCategory'}
        />
      )}
      {
        //! Submit
      }
      <div>
        <Button variant="primary" type="submit">
          {loading ? 'Loading...' : subCategoryId ? 'Cập nhật' : 'Tạo Kiểu ngay'}
        </Button>
      </div>
    </FormComponent>
  );
};

export default SubCategoryFormComponent;
