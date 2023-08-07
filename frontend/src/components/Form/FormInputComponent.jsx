import { method } from "lodash";
import React from "react";
import { Row, Col, Form } from "react-bootstrap";

const FormInputComponent = ({
  methods,
  name,
  label,
  className,
  handleKeyPress,
  handleChange,
  ...rest
}) => {
  const registeredInput = methods.register(name);

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
          {...registeredInput}
          onChange={
            handleChange
              ? (e) => {
                  handleChange(e, registeredInput, methods);
                }
              : (e) => registeredInput.onChange(e)
          }
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

export default FormInputComponent;
