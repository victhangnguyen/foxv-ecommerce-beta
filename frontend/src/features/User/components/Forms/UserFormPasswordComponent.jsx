import _ from 'lodash';
import React from 'react';
import * as yup from 'yup';

//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../../components/Forms/FormComponent';
import ImageComponent from '../../../../components/Forms/ImageComponent';
import InputComponent from '../../../../components/Forms/InputComponent';
import SelectComponent from '../../../../components/Forms/SelectComponent';
import SelectControllerComponent from '../../../../components/Forms/SelectControllerComponent';
import TagControllerComponent from '../../../../components/Forms/TagControllerComponent';

const UserFormComponent = ({ user, initialValues, loading, onSubmit }) => {
  const phoneNumerRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  const unicodeLetters = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF ]+$/;
  const alphanumbericLetters = /^[a-zA-Z0-9]+$/;

  // .min(8, 'Ít nhất 8 ký tự.')
  // .max(64, 'Nhiều nhất 64 ký tự.')
  const validationSchema = yup.object({
    password: yup
      .string()
      .required('Yêu cầu nhập Mật khẩu')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Ít nhất 8 ký tự, 1 chữ In hoa, 1 chữ số và 1 chữ cái đặc biệt'
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Mật khẩu nhập lại không chính xác')
      .required('Yêu cầu nhập Xác nhận mật khẩu'),
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
          //! password
        }
        <InputComponent
          type={'password'}
          name="password"
          label={'Thay đổi mật khẩu'}
          placeholder={'Nhập mật khẩu'}
          autoComplete={'false'}
        />

        {
          //! confirmPassword
        }
        <InputComponent
          type={'password'}
          name="confirmPassword"
          label={'Xác nhận mật khẩu mới'}
          placeholder={'Xác nhận mật khẩu của bạn'}
          autoComplete={'false'}
        />

        <div className="d-flex justify-content-center">
          <Button className="btn-submit" variant="primary" type="submit">
            Thay đổi mật khẩu
          </Button>
        </div>
      </FormComponent>
    </div>
  );
};

export default UserFormComponent;
