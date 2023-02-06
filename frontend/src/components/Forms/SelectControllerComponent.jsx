import React from 'react';
import { Controller } from 'react-hook-form';
import { Row, Col, Form } from 'react-bootstrap';

const SelectControllerComponent = ({
  methods,
  options,
  name,
  label,
  handleChange,
  ...rest
}) => {
  return (
    <Controller
      control={methods.control}
      name={name}
      render={({ field }) => (
        <Form.Group as={Row} className="mb-3" controlId={`ipt-${name}`}>
          <Form.Label>{label}</Form.Label>
          <Col>
            <Form.Select
              {...field}
              size="sm"
              isInvalid={methods.formState.errors[name] ? true : false}
              onChange={(e) => {
                field.onChange(e);
                handleChange(e, methods.setValue);
              }}
            >
              <option value={''}>Vui lòng chọn</option>
              {options?.map((option, index) => (
                <option key={option.key} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            {methods.formState.errors[name] && (
              <Form.Control.Feedback type="invalid">
                {methods.formState.errors[name].message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Form.Group>
      )}
    />
  );
};

export default SelectControllerComponent;
