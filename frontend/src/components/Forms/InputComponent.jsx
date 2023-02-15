import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const InputComponent = ({ methods, name, label, className, ...rest }) => {
  return (
    <Form.Group as={Row} className={className} controlId={`ipt-${name}`}>
      {label && <Form.Label>{label}</Form.Label>}
      <Col>
        <Form.Control
          {...methods.register(name)}
          isInvalid={methods.formState.errors[name] ? true : false}
          {...rest}
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

export default InputComponent;
