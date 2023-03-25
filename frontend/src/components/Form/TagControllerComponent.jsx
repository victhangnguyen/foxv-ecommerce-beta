import React from 'react';
import { Controller } from 'react-hook-form';
import CloseIcon from '../Icon/CloseIcon';
import { Col, Form } from 'react-bootstrap';

const TagControllerComponent = ({
  methods,
  name,
  label,
  options,
  placeholder,
  className,
  ...rest
}) => {
  const [value, setvalue] = React.useState();
  const removeTags = (tagIndex, value) => {
    methods.setValue(name, [...value.filter((_, index) => index !== tagIndex)]);
    // props.onChange([...tags.filter((_, index) => index !== tagIndex)]);
  };

  const addTags = (e, value) => {
    if (e.target.value === '') return; //! if Empty Input -> return
    const tags = value ? [...value] : [];
    methods.setValue(name, [...tags, e.target.value]);
    // props.onChange([...tags, event.target.value]);
    e.target.value = ''; //! reset input
  };

  return (
    <Form.Group className={className}>
      {label && <Form.Label>{label}</Form.Label>}
      <Col>
        <Controller
          control={methods.control}
          name={name}
          render={({ field, fieldState, formState }) => (
            <div
              className={`tags-input form-control ${
                methods.formState.errors[name] ? 'is-invalid' : ''
              }`}
            >
              <ul id="tags">
                {field.value?.map((tag, index) => (
                  <li key={index} className="tag">
                    <span className="tag-title">{tag}</span>
                    <span
                      className="tag-close-icon"
                      onClick={() => removeTags(index, field.value)}
                    >
                      <CloseIcon size={'.5rem'} color="#fff" />
                    </span>
                  </li>
                ))}
              </ul>
              <input
                type="tag"
                placeholder={placeholder}
                list="data"
                onKeyUp={(e) =>
                  e.key === 'Enter' ? addTags(e, field.value) : null
                }
              />
              <datalist id="data">
                {options?.map((option) => (
                  <option key={option.key} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </datalist>
            </div>
          )}
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

export default TagControllerComponent;
