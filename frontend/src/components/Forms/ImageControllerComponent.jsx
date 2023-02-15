import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller } from 'react-hook-form';

const ImageControllerComponent = ({
  methods,
  name,
  label,
  className,
  ...rest
}) => {
  const [imageMain, setImageMain] = React.useState();
  const eCountRef = React.useRef(0);

  const imagesFieldCountRef = React.useRef(0);

  const images = methods.getValues(name);
  const imagesCountRef = React.useRef(0);
  console.log(
    '%c__Debugger__ImageControllerComponent\n__***__images__',
    'color: chartreuse;',
    (imagesCountRef.current += 1),
    ':',
    images,
    '\n'
  );

  // React.useEffect(() => {
  //   const fileReaders = [];
  //   let isCancel = false;
  //   if (images?.length) {
  //     const promises = Array.from(images).map((file) => {
  //       return new Promise((resolve, reject) => {
  //         const fileReader = new FileReader();
  //         fileReaders.push(fileReader);
  //         fileReader.onload = (e) => {
  //           const { result } = e.target;
  //           if (result) {
  //             resolve(result);
  //           }
  //         };
  //         fileReader.onabort = () => {
  //           reject(new Error('File reading aborted'));
  //         };
  //         fileReader.onerror = () => {
  //           reject(new Error('Failed to read file'));
  //         };
  //         fileReader.readAsDataURL(file);
  //       });
  //     });

  //     Promise.all(promises)
  //       .then((images) => {
  //         if (!isCancel) {
  //           // setImages(images);
  //           methods.setValue(name, images);
  //           setImageMain(images[0]);
  //         }
  //       })
  //       .catch((reason) => {
  //         console.log(reason);
  //       });
  //   }
  //   return () => {
  //     isCancel = true;
  //     fileReaders.forEach((fileReader) => {
  //       if (fileReader.readyState === 1) {
  //         fileReader.abort();
  //       }
  //     });
  //   };
  // }, [images]);

  return (
    <Controller
      control={methods.control}
      name={name}
      render={({ field }) => {
        const imagesField = field.value;
        console.log(
          '%c__Debugger__ImageControllerComponent\n__Controller__imagesField__',
          'color: DarkOrange;',
          (imagesFieldCountRef.current += 1),
          ':',
          imagesField,
          '\n'
        );
        return (
          <Form.Group
            as={Row}
            className={`form-image ${className}`}
            controlId={`ipt-${name}`}
          >
            <Form.Label>{label}</Form.Label>
            <div className="form-image__image-main">
              {(imageMain && <img src={imageMain} alt="" />) ||
                (imagesField && <img src={imagesField[0]} alt="" />) ||
                null}
            </div>
            <div className="form-image__image-slides">
              {imagesField?.length
                ? imagesField.map((image, index) => {
                    return (
                      <div
                        key={index}
                        className="form-image__image-slides__image-slide"
                        onClick={() => setImageMain(imagesField[index])}
                      >
                        <img src={image} alt={image} />
                      </div>
                    );
                  })
                : null}
            </div>
            <Col>
              <Form.Control
                type="file"
                size="sm"
                isInvalid={methods.formState.errors[name] ? true : false}
                onChange={(e) => {
                  // field.onChange(e);
                  //! TRIGGER handleChange(e, setValue)
                  console.log(
                    '%c__Debugger__ImageControllerComponent\n__FormControl__e__',
                    'color: Cyan;',
                    (eCountRef.current += 1),
                    ':',
                    e,
                    '\n'
                  );

                  const fileReaders = [];
                  let isCancel = false;
                  if (e.target.files?.length) {
                    const promises = Array.from(e.target.files).map((file) => {
                      return new Promise((resolve, reject) => {
                        const fileReader = new FileReader();
                        fileReaders.push(fileReader);
                        fileReader.onload = (e) => {
                          const { result } = e.target;
                          if (result) {
                            resolve(result);
                          }
                        };
                        fileReader.onabort = () => {
                          reject(new Error('File reading aborted'));
                        };
                        fileReader.onerror = () => {
                          reject(new Error('Failed to read file'));
                        };
                        fileReader.readAsDataURL(file);
                      });
                    });

                    Promise.all(promises)
                      .then((images) => {
                        if (!isCancel) {
                          // setImages(images);
                          field.onChange(images);
                          setImageMain(images[0]);
                        }
                      })
                      .catch((reason) => {
                        console.log(reason);
                      });
                  }
                  // return () => {
                  //   isCancel = true;
                  //   fileReaders.forEach((fileReader) => {
                  //     if (fileReader.readyState === 1) {
                  //       fileReader.abort();
                  //     }
                  //   });
                  // };
                }}
                {...rest}
              />
            </Col>
            {methods.formState.errors[name] && ( //! ok
              <Form.Control.Feedback type="invalid">
                {methods.formState.errors[name].message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        );
      }}
    />
  );
};

export default ImageControllerComponent;
