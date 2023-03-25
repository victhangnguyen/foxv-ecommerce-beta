import React from 'react';
import _ from 'lodash';

const ImageComponent = ({ product, className, ...rest }) => {
  const REACT_APP_SERVER = 'http://127.0.0.1';
  const REACT_APP_PORT = 5000;
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;

  const [imageMain, setImageMain] = React.useState(null);

  const images = product?.images;
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
        <img src={imagesUrl + image} alt="" />
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
                ? imagesUrl + imageMain
                : images
                ? imagesUrl + images[0]
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
