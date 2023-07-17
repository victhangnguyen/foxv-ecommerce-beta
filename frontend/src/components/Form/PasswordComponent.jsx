import React from "react";
import zxcvbn from "zxcvbn";
import { Form, Row, Col, ProgressBar } from "react-bootstrap";

const PasswordComponent = ({
  methods,
  name,
  label,
  className,
  ...rest
}) => {
  const [type, setType] = React.useState("password");

  const password = methods.getValues()?.password || "";

  function handleClickShowPassword(e) {
    e.preventDefault();
    e.stopPropagation();
    setType((prevState) => (prevState === "text" ? "password" : "text"));
  }

  return (
    <Form.Group className={`form-group mb-3 `} controlId={`ipt-${name}`}>
      {label && <Form.Label>{label}</Form.Label>}
      <div className="field">
        <Form.Control
          {...rest}
          {...methods.register(name)}
          type={type}
          isInvalid={methods.formState.errors[name] ? true : false}
          size="sm"
        />
        <span className="btn-show" onClick={handleClickShowPassword}>
          {type === "text" ? "Hide" : "Show"}
        </span>
      </div>
      {methods.formState.errors[name] && (
        <div className="form-invalid-feedback">
          {methods.formState.errors[name].message}
        </div>
      )}
    </Form.Group>
  );
};

export default PasswordComponent;
