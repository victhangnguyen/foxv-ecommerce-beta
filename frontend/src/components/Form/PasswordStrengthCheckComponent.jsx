import React from "react";
import zxcvbn from "zxcvbn";
import { Form, Row, Col, ProgressBar } from "react-bootstrap";

const PasswordStrengthCheckComponent = ({
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

  console.log('__Debugger__PasswordStrengthCheckComponent\n__***__methods.formState.errors: ', methods.formState.errors, '\n');

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
      <PasswordComplexity password={password} />
    </Form.Group>
  );
};

const PasswordComplexity = ({ password }) => {
  const complexityScore = zxcvbn(password).score;
  const progressRate = (complexityScore * 100) / 4;

  function funcProgressStyle() {
    switch (complexityScore) {
      case 0:
        return { label: "Rất yếu", color: "grey" };
      case 1:
        return { label: "Yếu", color: "red" };
      case 2:
        return { label: "Khá", color: "orange" };
      case 3:
        return { label: "Mạnh", color: "darkgreen" };
      case 4:
        return { label: "Rất mạnh", color: "green" };
      default:
        return { label: "", color: "none" };
    }
  }

  function changeProgressBarColor() {
    return {
      width: `${progressRate}%`,
      background: funcProgressStyle().color,
      height: "10px",
    };
  }

  return (
    <>
      <div style={{ color: funcProgressStyle().color }}>
        Độ bảo mật: <span>{funcProgressStyle().label}</span>
      </div>
      <ProgressBar style={changeProgressBarColor()} />
    </>
  );
};

export default PasswordStrengthCheckComponent;
