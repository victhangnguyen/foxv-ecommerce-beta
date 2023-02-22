import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm, useWatch } from 'react-hook-form';

const useYupValidationResolver = (validationSchema) =>
  React.useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

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
    // defaultValues: defaultValues,
  });

  const watchAllFields = useWatch({ control: methods.control });

  const watchAllFieldsCountRef = React.useRef(0);
  console.log(
    '%c__Debugger__FormComponent\n__***__watchAllFields__',
    'color: Brown;',
    (watchAllFieldsCountRef.current += 1),
    ':',
    watchAllFields
  );

  const fields = children.map((child) => child.props?.name);
  //! initialize Values
  React.useEffect(() => {
    //! if initialValues is Empty
    if (Object.keys(initialValues).length) {
      fields.forEach((field) => {
        if (!field) return;
        methods.setValue(field, initialValues[field]);
      });
    }
  }, [JSON.stringify(initialValues)]);

  // //! initialize Values
  // React.useEffect(() => {
  //   methods.reset(initialValues);
  // }, [methods.reset, initialValues]);

  const checkKeyDown = (e) => {
    if (e.code === 'Enter') {
      if (e.target.nodeName !== 'TEXTAREA') {
        e.preventDefault();
      }
    }
  };

  return (
    <Form
      onSubmit={methods.handleSubmit(onSubmit)}
      onKeyDown={(e) => checkKeyDown(e)}
      {...rest}
    >
      {Array.isArray(children)
        ? children.map((child) => {
            return child.props?.name
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
    </Form>
  );
};

export default FormComponent;
