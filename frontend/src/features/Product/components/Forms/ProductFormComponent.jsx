import React from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
//! imp Components
import { Row, Col, Button } from 'react-bootstrap';
import FormComponent from '../../../../components/Forms/FormComponent';
import InputComponent from '../../../../components/Forms/InputComponent';
import SelectComponent from '../../../../components/Forms/SelectComponent';
import SelectControllerComponent from '../../../../components/Forms/SelectControllerComponent';
import TagComponent from '../../../../components/Forms/TagComponent';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, 'Ít nhất 4 ký tự.')
    .max(32, 'Nhiều nhất 32 ký tự.')
    .required('Yêu cầu nhập Tên sản phẩm.'),
  description: yup
    .string()
    .min(10, 'Ít nhất 10 ký tự.')
    .max(1000, 'Nhiều nhất 1000 ký tự.'),
  // category: yup
  //   .string()
  //   .min(24, 'Category không hợp lệ')
  //   .max(24, 'Category không hợp lệ'),
  subCategories: yup.array().of(yup.string()),
  price: yup
    .number()
    .max(5000000, 'Nhiều nhất là 5 triệu')
    .min(0, 'Không được nhỏ hơn 0')
    .required('Yêu cầu nhập Giá sản phẩm'),
});

const ProductFormComponent = ({
  product,
  categories,
  subOptions,
  handleCategoryChange,
  showSub,
  loading,
  onSubmit,
  labelButton = 'Tạo ngay',
}) => {
  const { productId } = useParams();
  console.log('__Debugger__ProductFormComponent__productId: ', productId);

  // const defaultValues = {
  //   name: '',
  //   image: '',
  //   description: '',
  //   category: '',
  //   subCategories: [],
  //   price: 0,
  //   shipping: 'no',
  //   quantity: 0,
  //   color: '',
  //   brand: '',
  // };

  // const categoryOptions = categories?.map((category) => ({
  //   key: category._id,
  //   value: category._id,
  //   label: category.name,
  // }));

  // const subCategoryOptions = subOptions?.map((sub) => ({
  //   key: sub._id,
  //   value: sub._id,
  //   label: sub.name,
  // }));

  // const shippingOptions = [
  //   { key: 0, value: 'no', label: 'No' },
  //   { key: 1, value: 'yes', label: 'Yes' },
  // ];

  // const colorOptions = [{ key: 0, value: 'black', label: 'Black' }];

  // const brandOptions = [{ key: 0, value: 'dior', label: 'Dior' }];

  return (
    <div className="mb-4 p-3">
      <FormComponent validationSchema={validationSchema} onSubmit={onSubmit}>
        <Row>
          <Col md={4}>
            <InputComponent
              name="name"
              label={'Tên sản phẩm'}
              placeholder={'Nhập tên sản phẩm'}
            />
            <InputComponent
              as="textarea"
              name="description"
              label={'Mô tả sản phẩm'}
              placeholder={'Nhập mô tả sản phẩm'}
            />
          </Col>
          <Col md={4}>hifnh anh</Col>
        </Row>
      </FormComponent>
    </div>
  );
};

export default ProductFormComponent;

{
  /* <FormComponent
values={product}
defaultValues={defaultValues}
validationSchema={validationSchema}
onSubmit={onSubmit}
>
{
  //! name
}
<InputComponent
  name="name"
  label={'Tên sản phẩm'}
  placeholder={'Nhập tên sản phẩm'}
/>
{
  //! image
}
<InputComponent
  type="file"
  name="image"
  label={'Hình ảnh sản phẩm'}
  placeholder={'Chọn hình sản phẩm'}
/>
{
  //! description
}
<InputComponent
  as="textarea"
  name="description"
  label={'Mô tả sản phẩm'}
  placeholder={'Nhập mô tả sản phẩm'}
/>
{
  //! category
}
<SelectControllerComponent
  handleChange={handleCategoryChange}
  name={'category'}
  label={'Sản phẩm thuộc loại'}
  options={categoryOptions}
/>
{
  //! subCategories
}
{showSub ? (
  <TagComponent
    name="subCategories"
    label={'Tag nhãn sản phẩm (Loại / Kiểu / Size / Màu)'}
    options={subCategoryOptions}
    placeholder={'Enter để nhập nhãn sản phẩm'}
  />
) : (
  <></>
)}
{
  //! price
}
<InputComponent
  type="number"
  name={'price'}
  label={'Giá sản phẩm'}
  placeholder={'Nhập giá sản phẩm'}
/>
{
  //! shipping
}
<SelectComponent
  name={'shipping'}
  label={'[Status]: Miễn phí Vận chuyển'}
  options={shippingOptions}
/>
{
  //! quantity
}
<InputComponent
  type="number"
  name={'quantity'}
  label={'Số lượng sản phẩm'}
  placeholder={'Nhập số lượng sản phẩm'}
/>
{
  //! color
}
<SelectComponent
  name={'color'}
  label={'Màu sắc'}
  options={colorOptions}
/>
{
  //! brand
}
<SelectComponent
  name={'brand'}
  label={'Thương hiệu'}
  options={brandOptions}
/>
{
  //! Submit
}
<div>
  <Button variant="primary" type="submit">
    {loading ? 'Loading...' : labelButton}
  </Button>
</div>
</FormComponent> */
}
