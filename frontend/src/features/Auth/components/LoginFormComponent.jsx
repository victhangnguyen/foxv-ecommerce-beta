import React from "react";
import * as yup from "yup";
//! imp Comps
import { Button } from "react-bootstrap";
import FormComponent from "../../../components/Form/FormComponent";
import InputComponent from "../../../components/Form/InputComponent";
import FormInputComponent from "../../../components/Form/FormInputComponent";
import PasswordComponent from "../../../components/Form/PasswordComponent";

const LoginFormComponent = ({ onSubmit }) => {
  const validationSchema = yup.object({
    username: yup.string().required("Yêu cầu nhập Username"),
    password: yup.string().required("Yêu cầu nhập Mật khẩu"),
  });

  function handleChangeUserName(e, registeredInput, methods) {
    e.target.value = e?.target?.value?.toLowerCase()
    registeredInput.onChange(e);
  }

  return (
    <FormComponent
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      className="form-login"
    >
      {
        //! username
      }
      <FormInputComponent
        type={"text"}
        name="username"
        label={"Username"}
        placeholder={"Nhập username của bạn"}
        handleChange={handleChangeUserName}
      />
      {
        //! password
      }
      <PasswordComponent
        type={"password"}
        name="password"
        label={"Mật khẩu"}
        placeholder={"Nhập mật khẩu"}
        autoComplete={"true"}
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
