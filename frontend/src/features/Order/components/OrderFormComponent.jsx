import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import * as yup from 'yup';

//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../components/Form/FormComponent';
import InputComponent from '../../../components/Form/InputComponent';

const OrderFormComponent = ({ user, initialValues, loading, onSubmit }) => {
  const phoneNumerRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  const unicodeLetters = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF ]+$/;
  const alphanumbericLetters = /^[a-zA-Z0-9]+$/;

  const auth = useSelector((state) => state.auth);
  const isAdminController = auth.user?.roles
    ?.map((role) => role.name)
    .includes('admin');

  const validationSchema = yup.object({
    username: yup
      .string()
      .matches(
        alphanumbericLetters,
        'Username không được có những ký tự đặc biệt'
      )
      .min(8, 'Ít nhất 8 ký tự.')
      .max(64, 'Nhiều nhất 64 ký tự.')
      .required('Yêu cầu nhập Username của bạn'),
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Yêu cầu nhập email của bạn'),
    lastName: yup
      .string()
      .min(2, 'Ít nhất 2 ký tự.')
      .max(32, 'Nhiều nhất 32 ký tự.')
      .matches(unicodeLetters, 'Họ không hợp lệ, nên nhập ký tự (a-z)')
      .required('Vui lòng nhập Họ của bạn.'),
    firstName: yup
      .string()
      .min(2, 'Ít nhất 2 ký tự.')
      .max(32, 'Nhiều nhất 32 ký tự.')
      .matches(unicodeLetters, 'Tên không hợp lệ, nên nhập ký tự (a-z)')
      .required('Vui lòng nhập Tên của bạn.'),
    phoneNumber: yup
      .string()
      .min(8, 'Ít nhất 8 ký tự.')
      .max(32, 'Nhiều nhất 32 ký tự.')
      .matches(phoneNumerRegExp, 'Số điện thoại không hợp lệ')
      .required('Yêu cầu nhập số điện thoại'),
  });

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
          readOnly
          name="name"
          label={'Họ và tên'}
          // placeholder={'Họ và tên của bạn'}
        />
        {
          //! address
        }
        <InputComponent
          readOnly
          name="address"
          label={'Địa chỉ nhận hàng'}
          // placeholder={'Địa chỉ của bạn'}
        />
        {
          //! orderId
        }
        <InputComponent readOnly name="orderId" label={'Mã đơn hàng'} />
        {
          //! orderDate
        }
        <InputComponent readOnly name="orderDate" label={'Ngày lập đơn hàng'} />
        {
          //! status
        }
        <InputComponent readOnly name="status" label={'Tình trạng đơn hàng'} />
        {
          //! transactionNo
        }
        <InputComponent readOnly name="transactionNo" label={'Mã giao dịch'} />
        {
          //! bankTranNo
        }
        <InputComponent
          readOnly
          name="bankTranNo"
          label={'Mã giao dịch ngân hàng'}
        />
        {
          //! Button
        }
        {isAdminController && (
          <div className="d-flex justify-content-center">
            <Button className="btn-submit" variant="primary" type="submit">
              {loading
                ? 'Loading...'
                : 'Cập nhật đơn hàng'}
            </Button>
          </div>
        )}
      </FormComponent>
    </div>
  );
};

export default OrderFormComponent;
