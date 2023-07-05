import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const PasswordStrengthCheckComponent = ({
  methods,
  name,
  label,
  className,
  ...rest
}) => {
  return (
    <Form.Group
      as={Row}
      className={`mb-3 ${name ? "form-group" + name : null}`}
      controlId={`ipt-${name}`}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <Col>
        <Form.Control
          {...rest}
          {...methods.register(name)}
          isInvalid={methods.formState.errors[name] ? true : false}
          size="sm"
        />
        {methods.formState.errors[name] && (
          <Form.Control.Feedback type="invalid">
            {methods.formState.errors[name].message}
          </Form.Control.Feedback>
        )}
      </Col>
    </Form.Group>
  );
};

export default PasswordStrengthCheckComponent;
