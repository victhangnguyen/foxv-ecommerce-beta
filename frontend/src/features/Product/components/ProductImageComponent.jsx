import React from "react";
import _ from "lodash";

const ProductImageComponent = ({ product, className, ...rest }) => {
  const [indexMainImage, setIndexMainImage] = React.useState(0);
  const images = product?.images;
  //! handle FileList
  const handleClickImage = (index) => {
    setIndexMainImage(index);
  };

  const renderSlices = images?.map((image, index) => {
    // const renderSlices = imageFiles.map((image, index) => {
    return (
      <div
        key={index}
        className="image-slide"
        onClick={() => handleClickImage(index)}
      >
        <img src={image} alt="" />
      </div>
    );
  });

  return (
    <div className="form-image">
      <div className="image-main">
        <div className="image-body">
          <img src={images[indexMainImage]} alt="" />
        </div>
      </div>
      <div className="image-slides">{renderSlices}</div>
    </div>
  );
};

export default ProductImageComponent;
