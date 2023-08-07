import React from "react";
import * as yup from "yup";
//! imp Comps
import { Button } from "react-bootstrap";
import FormComponent from "../../../components/Form/FormComponent";
import InputComponent from "../../../components/Form/InputComponent";
import FormInputComponent from "../../../components/Form/FormInputComponent";

const ForgotPasswordFormScreen = ({ onSubmit }) => {
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Yêu cầu nhập email của bạn"),
  });

  function handleChangeEmail(e, registeredInput, methods) {
    e.target.value = e?.target?.value?.toLowerCase();
    registeredInput.onChange(e);
  }

  return (
    <FormComponent
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      className="form-forgot-pasword"
    >
      {
        //! email
      }
      <FormInputComponent
        type={"email"}
        name="email"
        label={"Email"}
        placeholder={"Nhập email của bạn"}
        handleChange={handleChangeEmail}
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
