import React from 'react';
import * as yup from 'yup';

//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../../components/Form/FormComponent';
import ImageComponent from '../../../../components/Form/ImageComponent';
import InputComponent from '../../../../components/Form/InputComponent';
import SelectComponent from '../../../../components/Form/SelectComponent';
import SelectControllerComponent from '../../../../components/Form/SelectControllerComponent';
import TagControllerComponent from '../../../../components/Form/TagControllerComponent';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Ít nhất 2 ký tự.')
    .max(256, 'Nhiều nhất 256 ký tự.')
    .required('Yêu cầu nhập Tên sản phẩm.'),
  description: yup
    .string()
    .min(4, 'Ít nhất 4 ký tự.')
    .max(1024, 'Nhiều nhất 1024 ký tự.'),
  category: yup.string().required('Yêu cầu chọn Kiểu sản phẩm.'),
  //   .string()
  //   .min(24, 'Category không hợp lệ')
  //   .max(24, 'Category không hợp lệ'),
  // subCategories: yup
  //   .array()
  //   .of(yup.string())
  //   .required('Yêu cầu chọn Kiểu sản phẩm.'),
  price: yup
    .number()
    .min(0, 'Không được nhỏ hơn 0')
    .max(10000000, 'Nhiều nhất là 10 triệu'),
  //   quantity: yup
  //     .number()
  //     .min(0, 'Không được nhỏ hơn 0')
  //     .max(10000000, 'Nhiều nhất là 10 triệu'),
});

const ProductFormComponent = ({
  productId,
  initialValues,
  categories,
  subCategories,
  triggerSelectCategoryChange,
  showSub,
  loading,
  onSubmit,
}) => {
  const categoryOpts = categories?.map((category) => ({
    key: category._id,
    value: category._id,
    label: category.name,
  }));

  const subCategoryOpts = subCategories?.map((sub) => ({
    key: sub._id,
    value: sub._id,
    label: sub.name,
  }));

  const shippingOptions = [
    { key: 0, value: 'no', label: 'No' },
    { key: 1, value: 'yes', label: 'Yes' },
  ];

  const colorOptions = [{ key: 0, value: 'black', label: 'Black' }];

  const brandOptions = [{ key: 0, value: 'dior', label: 'Dior' }];

  return (
    <div className="screen-body mb-4 p-3">
      <FormComponent
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        className="form-product"
      >
        {
          //! name
        }
        <InputComponent
          name="name"
          label={'Tên sản phẩm'}
          placeholder={'Nhập tên sản phẩm'}
          className={'mb-3 form-group-name'}
        />
        {
          //! description
        }
        <InputComponent
          as="textarea"
          name="description"
          label={'Mô tả sản phẩm'}
          placeholder={'Nhập mô tả sản phẩm'}
          className={'mb-3 form-group-description'}
        />
        {
          //! category
        }
        <SelectControllerComponent
          triggerSelectChange={triggerSelectCategoryChange}
          name={'category'}
          label={'Loại sản phẩm'}
          options={categoryOpts}
          className={'mb-3 form-group-cateogry'}
        />
        {
          //! subCategories
        }
        {showSub || productId ? (
          <TagControllerComponent
            name="subCategories"
            label={'Kiểu sản phẩm'}
            options={subCategoryOpts}
            placeholder={'Enter để nhập nhãn sản phẩm'}
            className={'mb-3 form-group-subcategories'}
          />
        ) : (
          <div></div>
        )}
        {
          //! price
        }
        <InputComponent
          type="number"
          name={'price'}
          min={0}
          max={10000000}
          step={10000}
          label={'Giá sản phẩm'}
          placeholder={'Nhập giá sản phẩm'}
          className={'mb-3 form-group-price'}
        />
        {
          //! shipping
        }
        <SelectComponent
          name={'shipping'}
          label={'[Status]: Miễn phí Vận chuyển'}
          options={shippingOptions}
          className={'mb-3 form-group-shipping'}
        />
        {
          //! quantity
        }
        <InputComponent
          type="number"
          name={'quantity'}
          min={0}
          max={10000000}
          step={50}
          label={'Số lượng sản phẩm'}
          placeholder={'Nhập số lượng sản phẩm'}
          className={'mb-3 form-group-quantity'}
        />
        {
          //! color
        }
        <SelectComponent
          name={'color'}
          label={'Màu sắc'}
          options={colorOptions}
          className={'mb-3 form-group-color'}
        />
        {
          //! brand
        }
        <SelectComponent
          name={'brand'}
          label={'Thương hiệu'}
          options={brandOptions}
          className={'mb-3 form-group-brand'}
        />
        {
          //! image
        }
        <ImageComponent
          name={'images'}
          label={'Hình ảnh sản phẩm'}
          className={'mb-3 form-group-images'}
          multiple
        />
        {
          //! Submit
        }
        <Button className="btn-submit" variant="primary" type="submit">
          {loading
            ? 'Loading...'
            : productId
            ? 'Cập nhật sản phẩm'
            : 'Thêm sản phẩm'}
        </Button>
      </FormComponent>
    </div>
  );
};

export default ProductFormComponent;
