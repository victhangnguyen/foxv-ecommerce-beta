import React from 'react';
import { Row, Col, Form, Image } from 'react-bootstrap';

const ImageComponent = ({ methods, name, label, className, ...rest }) => {
  const [imageMain, setImageMain] = React.useState(null);
  const [images, setImages] = React.useState();
  // const [imageFiles, setImageFiles] = React.useState([]);
  const imageFiles = methods.getValues(name) || [];

  React.useEffect(() => {
    setImages(imageFiles);
    setImageMain(imageFiles[0]);
  }, [imageFiles]);

  // const getValuesCountRef = React.useRef(0);
  // console.log(
  //   '%c__Debugger__FormComponent\n__***__getValues__',
  //   'color: chartreuse;',
  //   (getValuesCountRef.current += 1),
  //   ':',
  //   methods.getValues(name)
  // );

  // React.useEffect(() => {
  //   const fileReaders = [];
  //   let isCancel = false;
  //   if (imageFiles.length) {
  //     const promises = Array.from(imageFiles).map((file) => {
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
  //    
  //     Promise.all(promises)
  //       .then((images) => {
  //         if (!isCancel) {
  //           setImages(images);
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
  // }, [imageFiles]);

  const handleImage = (index) => {
    setImageMain(images[index]);
  };

  const imagesCountRef = React.useRef(0);
  console.log(
    '%c__Debugger__ImageComponent\n__***__images__',
    'color: Gold;',
    (imagesCountRef.current += 1),
    ':',
    images,
    '\n'
  );

  const renderSlices = images?.map((image, index) => {
    // const renderSlices = imageFiles.map((image, index) => {
    return (
      <div
        key={index}
        className="form-image__image-slides__image-slide"
        onClick={() => handleImage(index)}
      >
        <img src={images[index]} alt="" />
        {/* <img src={`${baseUrl}:${port}:/${imageFiles[index]}`} alt="" /> */}
        {/* <img src={`${baseUrl}:${port}/${imageFiles[index]}`} alt="" /> */}
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
          {imageMain && <img src={imageMain} alt="" />}
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
