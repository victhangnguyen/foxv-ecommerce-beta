import React from 'react';
import _ from 'lodash';

const REACT_APP_SERVER = 'http://127.0.0.1';
const REACT_APP_PORT = 5000;

const ImageComponent = ({ product, className, ...rest }) => {
  const [imageMain, setImageMain] = React.useState(null);

  const images = product?.images;
  console.log(
    '__Debugger__ProductImageComponent\n__***__images: ',
    images,
    '\n'
  );

  //! handle FileList
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
          src={`${REACT_APP_SERVER}:${REACT_APP_PORT}/images/${image}`}
          alt=""
        />
      </div>
    );
  });

  return (
    <>
      <div className="form-image__image-main">
        {
          <img
            src={
              imageMain
                ? `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/${imageMain}`
                : images
                ? `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/${images[0]}`
                : null
            }
            alt=""
          />
        }
      </div>
      <div className="form-image__image-slides">{renderSlices}</div>
    </>
  );
};

export default ImageComponent;
