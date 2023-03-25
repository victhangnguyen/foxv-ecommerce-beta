import React from 'react';
import * as yup from 'yup';
//! imp Comps
import { Button } from 'react-bootstrap';
import FormComponent from '../../../components/Form/FormComponent';
import InputComponent from '../../../components/Form/InputComponent';

const ForgotPasswordFormScreen = ({ onSubmit }) => {
  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Yêu cầu nhập email của bạn'),
  });

  return (
    <FormComponent
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      className="form-forgot-pasword"
    >
      {
        //! email
      }
      <InputComponent
        type={'email'}
        name="email"
        label={'Email'}
        placeholder={'Nhập email của bạn'}
      />
      <div className="d-flex justify-content-center">
        <Button className="btn-submit w-100" variant="primary" type="submit">
          Khôi phục mật khẩu
        </Button>
      </div>
    </FormComponent>
  );
};

export default ForgotPasswordFormScreen;
