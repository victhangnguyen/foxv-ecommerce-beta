import React from 'react';
import * as yup from 'yup';
//! imp Comps
import { Button } from 'react-bootstrap';
import FormComponent from '../../../components/Form/FormComponent';
import InputComponent from '../../../components/Form/InputComponent';

const LoginFormComponent = ({ onSubmit }) => {
  const validationSchema = yup.object({
    username: yup.string().required('Yêu cầu nhập Username'),
    password: yup.string().required('Yêu cầu nhập Mật khẩu'),
  });

  return (
    <FormComponent
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      className="form-login"
    >
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
        //! password
      }
      <InputComponent
        type={'password'}
        name="password"
        label={'Mật khẩu'}
        placeholder={'Nhập mật khẩu'}
        autoComplete={'true'}
      />
      <div className="d-flex justify-content-center">
        <Button className="btn-submit w-100" variant="primary" type="submit">
          Đăng nhập
        </Button>
      </div>
    </FormComponent>
  );
};

export default LoginFormComponent;
