import _ from 'lodash';
import React from 'react';
import * as yup from 'yup';

//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../../components/Form/FormComponent';
import InputComponent from '../../../../components/Form/InputComponent';

const UserFormComponent = ({ user, initialValues, loading, onSubmit }) => {
  const phoneNumerRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  const unicodeLetters = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF ]+$/;
  const alphanumbericLetters = /^[a-zA-Z0-9]+$/;

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
          //! lastName
        }
        <InputComponent
          name="lastName"
          label={'Họ'}
          placeholder={'Nhập họ của bạn'}
        />

        {
          //! firstName
        }
        <InputComponent
          name="firstName"
          label={'Tên'}
          placeholder={'Nhập tên của bạn'}
        />
        {
          //! username
        }
        <InputComponent
          type={'text'}
          name="username"
          label={'Username'}
          placeholder={'Nhập username của bạn'}
        />
        {
          //! email
        }
        <InputComponent
          type={'email'}
          name="email"
          label={'Email'}
          placeholder={'Nhập email của bạn'}
        />
        {
          //! phoneNumber
        }
        <InputComponent
          name="phoneNumber"
          label={'Số điện thoại'}
          placeholder={'Nhập số điện thoại của bạn'}
        />
        <div className="d-flex justify-content-center">
          <Button className="btn-submit" variant="primary" type="submit">
            {loading
              ? 'Loading...'
              : _.isEmpty(user)
              ? 'Tạo tài khoản mới'
              : 'Cập nhật tài khoản'}
          </Button>
        </div>
      </FormComponent>
    </div>
  );
};

export default UserFormComponent;
