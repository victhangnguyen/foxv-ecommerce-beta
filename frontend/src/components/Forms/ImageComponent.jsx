import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const ImageComponent = ({ methods, name, label, className, ...rest }) => {
  const [imageMain, setImageMain] = React.useState(null);
  const [images, setImages] = React.useState();

  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;

  const imageFiles = methods.getValues(name) || [];

  React.useEffect(() => {
    //! if Array (response from Backend)
    if (Array.isArray(imageFiles)) {
      //! rhf.State === Array
      setImages(imageFiles);
      setImageMain(imageFiles[0]);
      return;
    }

    //! handle FileList
    const fileReaders = [];
    let isCancel = false;
    if (imageFiles.length) {
      const promises = Array.from(imageFiles).map((file) => {
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
            setImages(images);
            setImageMain(images[0]);
          }
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [imageFiles]);

  const handleImage = (index) => {
    setImageMain(images[index]);
  };

  const renderSlices = images?.map((image, index) => {
    // const renderSlices = imageFiles.map((image, index) => {
    return (
      <div
        key={index}
        className="form-image__image-slides__image-slide"
        onClick={() => handleImage(index)}
      >
        <img
          src={image.includes('data:image/') ? image : imagesUrl + image}
          alt=""
        />
      </div>
    );
  });

  return (
    <Form.Group
      as={Row}
      className={`form-image ${className}`}
      controlId={`ipt-${name}`}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <div className="">
        <div className="form-image__image-main">
          {imageMain && (
            <img
              src={
                imageMain.includes('data:image/')
                  ? imageMain
                  : imagesUrl + imageMain
              }
              alt=""
            />
          )}
        </div>
        <div className="form-image__image-slides">{renderSlices}</div>
      </div>
      <Col>
        <Form.Control
          isInvalid={methods.formState.errors[name] ? true : false}
          size="sm"
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          {...methods.register(name)}
          {...rest}
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

export default ImageComponent;
