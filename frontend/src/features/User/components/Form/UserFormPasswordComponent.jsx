import React from "react";
import * as yup from "yup";

//! imp Comps
import { Button } from "react-bootstrap";
import FormComponent from "../../../../components/Form/FormComponent";
import PasswordComponent from "../../../../components/Form/PasswordComponent";
import PasswordStrengthCheckComponent from "../../../../components/Form/PasswordStrengthCheckComponent";

const UserFormPasswordComponent = ({
  initialValues,
  isAdminController,
  onSubmit,
}) => {
  const phoneNumerRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  const unicodeLetters = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF ]+$/;
  const alphanumbericLetters = /^[a-zA-Z0-9]+$/;

  const adminPasswordSchemaObject = yup.object().shape({
    password: yup
      .string()
      .required("Yêu cầu nhập Mật khẩu")
      .matches(/^(?=.{6,})/, "Cần phải trên 6 ký tự")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        "Mật khẩu cần phải có 1 ký tự in hoa và ký tự thường"
      )
      .matches(/^(?=.*[!@#\$%\^&\*])/, "Mật khẩu cần phải có 1 ký tự đặc biệt")
      .matches(/^(?=.{6,20}$)\D*\d/, "Mật khẩu cần phải có 1 số"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu nhập lại không chính xác")
      .required("Yêu cầu nhập Xác nhận mật khẩu"),
  });

  const currentPasswordSchemaObject = yup.object({
    currentPassword: yup.string().required("Yêu cầu nhập Mật khẩu"),
  });

  const validationSchema = isAdminController
    ? adminPasswordSchemaObject
    : adminPasswordSchemaObject.concat(currentPasswordSchemaObject);

  return (
    <div className="screen-body mb-4 p-3">
      <FormComponent
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        className="form-register"
      >
        {!isAdminController && (
          <PasswordComponent
            type={"password"}
            name="currentPassword"
            label={"Mật khẩu hiện tại"}
            placeholder={"Xác nhận mật khẩu hiện tại của bạn"}
            autoComplete={"false"}
          />
        )}
        {
          //! password
        }
        <PasswordStrengthCheckComponent
          type={"password"}
          name="password"
          label={"Mật khẩu mới"}
          placeholder={"Nhập mật khẩu"}
          autoComplete={"false"}
        />
        {/* <InputComponent
          type={'password'}
          name="password"
          label={'Mật khẩu mới'}
          placeholder={'Nhập mật khẩu'}
          autoComplete={'false'}
        /> */}

        {
          //! confirmPassword
        }
        <PasswordComponent
          type={"password"}
          name="confirmPassword"
          label={"Xác nhận mật khẩu mới"}
          placeholder={"Xác nhận mật khẩu của bạn"}
          autoComplete={"false"}
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

export default UserFormPasswordComponent;
