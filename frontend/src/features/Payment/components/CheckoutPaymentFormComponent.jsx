import _ from 'lodash';
import React from 'react';
import * as yup from 'yup';

//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../components/Form/FormComponent';
import InputComponent from '../../../components/Form/InputComponent';
import SelectControllerComponent from '../../../components/Form/SelectControllerComponent';

const CheckoutPaymentFormComponent = ({
  paymentData,
  initialValues,
  loading,
  onSubmit,
}) => {
  const phoneNumerRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  const unicodeLetters = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF ]+$/;
  const alphanumbericLetters = /^[a-zA-Z0-9]+$/;

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(2, 'Ít nhất 8 ký tự.')
      .max(32, 'Nhiều nhất 124 ký tự.')
      .matches(unicodeLetters, 'Họ không hợp lệ, nên nhập ký tự (a-z)')
      .required('Vui lòng nhập Họ và tên của bạn.'),
    address: yup
      .string()
      .min(2, 'Ít nhất 8 ký tự.')
      .max(32, 'Nhiều nhất 256 ký tự.')
      .required('Vui lòng nhập Địa chỉ của bạn.'),
    // email: yup
    //   .string()
    //   .email('Email không hợp lệ')
    //   .required('Yêu cầu nhập email của bạn'),
    // phoneNumber: yup
    //   .string()
    //   .min(8, 'Ít nhất 8 ký tự.')
    //   .max(32, 'Nhiều nhất 32 ký tự.')
    //   .matches(phoneNumerRegExp, 'Số điện thoại không hợp lệ')
    //   .required('Yêu cầu nhập số điện thoại'),
  });

  const bankCodeOpts = [
    {
      key: 'vnpayqrPaymentMethod',
      value: 'VNPAYQR',
      label: 'Thanh toán qua ứng dụng hỗ trợ VNPAYQR',
      description: 'Thanh toán qua ứng dụng hỗ trợ VNPAYQR',
    },
    {
      key: 'vnbankPaymentMethod',
      value: 'VNBANK',
      label: 'Thanh toán qua ATM-Tài khoản ngân hàng nội địa',
      description: 'Thanh toán qua ATM-Tài khoản ngân hàng nội địa',
    },
    {
      key: 'intcardPaymentMethod',
      value: 'INTCARD',
      label: 'Thanh toán qua thẻ quốc tế',
      description: 'Thanh toán qua thẻ quốc tế',
    },
  ];

  return (
    <div className="screen-body mb-4 p-3">
      <FormComponent
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        className="form-register"
      >
        {
          //! name
        }
        <InputComponent
          name="name"
          label={'Họ và tên người nhận'}
          placeholder={'Nhập họ và tên người nhận'}
        />
        {
          //! address
        }
        <InputComponent
          name="address"
          label={'Địa chỉ giao hàng'}
          placeholder={'Nhập địa chỉ giao hàng'}
        />
        {
          //! username
        }
        <SelectControllerComponent
          options={bankCodeOpts}
          name="bankCode"
          label={'Phương thức thanh toán'}
          optionLabel={'Cổng thanh toán VNPAYQR'}
        />

        <div className="d-flex justify-content-center mt-4">
          <Button className="btn-submit" variant="primary" type="submit">
            {loading ? 'Loading...' : 'Thanh toán'}
          </Button>
        </div>
      </FormComponent>
    </div>
  );
};

export default CheckoutPaymentFormComponent;
