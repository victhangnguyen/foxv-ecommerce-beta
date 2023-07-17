import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import _ from 'lodash';

//! imp Hooks
import { useYupValidationResolver } from '../../hooks/yupResolver';

const FormComponent = ({
  initialValues,
  defaultValues,
  validationSchema,
  onSubmit,
  children,
  ...rest
}) => {
  const resolver = useYupValidationResolver(validationSchema);

  const methods = useForm({
    resolver,
    mode: 'onTouched',
    criteriaMode: "all",
    // defaultValues: defaultValues,
  });

  const watchAllFields = useWatch({ control: methods.control });
  // console.log('watchAllFields: ', watchAllFields);

  const fields = children.map((child) => child?.props?.name);

  //! initialize Values
  React.useEffect(() => {
    if (!initialValues) return;

    if (Object.keys(initialValues).length) {
      fields.forEach((field) => {
        if (!field) return;
        methods.setValue(field, initialValues[field]);
      });
    }
  }, [JSON.stringify(initialValues)]);
  // }, [initialValues]);

  const checkKeyDown = (e) => {
    if (e.code === 'Enter') {
      if (e.target.nodeName !== 'TEXTAREA') {
        e.preventDefault();
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit((data, event) =>
        onSubmit(data, event, methods)
      )}
      // onSubmit={methods.handleSubmit(onSubmit)}
      onKeyDown={(e) => checkKeyDown(e)}
      {...rest}
    >
      {Array.isArray(children)
        ? children.map((child) => {
            return child?.props?.name
              ? React.createElement(child.type, {
                  ...{
                    ...child.props,
                    key: child.props.name,
                    methods,
                  },
                })
              : child;
          })
        : children}
    </form>
  );
};

export default FormComponent;
