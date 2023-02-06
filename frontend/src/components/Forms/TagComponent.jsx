import React from 'react';
import { Controller } from 'react-hook-form';
import CloseIcon from '../Icons/CloseIcon';
import { Form } from 'react-bootstrap';

const TagComponent = ({ methods, name, label, options, placeholder }) => {
  const removeTags = (tagIndex, value) => {
    methods.setValue(name, [...value.filter((_, index) => index !== tagIndex)]);
    // props.onChange([...tags.filter((_, index) => index !== tagIndex)]);
  };

  const addTags = (e, value) => {
    if (e.target.value === '') return; //! if Empty Input -> return

    methods.setValue(name, [...value, e.target.value]);
    // props.onChange([...tags, event.target.value]);
    e.target.value = ''; //! reset input
  };

  return (
    <div className="mb-3">
      {methods.formState.errors[name] && (
        <Form.Control.Feedback type="invalid">
          {methods.formState.errors[name].message}
        </Form.Control.Feedback>
      )}
      {label && <Form.Label>{label}</Form.Label>}

      <Controller
        control={methods.control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <div
            className={`tags-input form-control ${
              methods.formState.errors[name] ? 'is-invalid' : ''
            }`}
          >
            <ul id="tags">
              {value?.map((tag, index) => (
                <li key={index} className="tag">
                  <span className="tag-title">{tag}</span>
                  <span
                    className="tag-close-icon"
                    onClick={() => removeTags(index, value)}
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
              onKeyUp={(e) => e.key === 'Enter' ? addTags(e, value) : null}
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
    </div>
  );
};

export default TagComponent;
