import React from "react";
import { Col, Form, Row } from "react-bootstrap";
//! constants
import constants from "../../constants";
//! imp Comps
import MenuButtonComponent from "../Button/MenuButtonComponent";

const ImageComponent = ({ methods, name, label, className, ...rest }) => {
  const inputRef = React.useRef(null);
  // const [imagesArray, setimagesArray] = React.useState([]);

  const [imageMain, setImageMain] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const [actionType, setActionType] = React.useState(null);
  const [indexFile, setIndexFile] = React.useState(0);

  const REACT_APP_SERVER = "http://127.0.0.1";
  const REACT_APP_PORT = 5000;
  const imagesUrl = `${REACT_APP_SERVER}:${REACT_APP_PORT}/images/products/`;

  const imagesArray = methods.getValues(name) || [];

  const handleImageSliceClick = (index) => {
    console.log(
      "__Debugger__ImageComponent\n__handleImageSliceClick__index: ",
      index,
      "\n"
    );
    let mainImageUrl;
    if (imagesArray[index].type?.includes("image/")) {
      mainImageUrl = URL.createObjectURL(imagesArray[index]);
    } else {
      mainImageUrl = imagesArray[index];
    }
    setImageMain(mainImageUrl);

    // // Change the prop from multiple to single
    // inputRef.current.multiple = false;

    setIndexFile(index);
  };

  function handleActionType(type, indexFile) {
    if (type === constants.product.actionTypes.ALTER_IMAGE) {
      //! MODE: ALTER IMAGE
      inputRef.current.click();
      setActionType(constants.product.actionTypes.ALTER_IMAGE);
    } else if (type === constants.product.actionTypes.DELETE_IMAGE) {
      const updatedImagesArray = imagesArray.filter(
        (file, index) => index !== indexFile
      );
      console.log(
        "__Debugger__ImageComponent\n__DELETE-IMAGE__updatedImagesArray: ",
        updatedImagesArray,
        "\n"
      );
      methods.setValue(name, updatedImagesArray);
    } else {
      console.log("Chưa phát triển chức năng này");
    }
  }

  function handleAddImage() {
    inputRef.current.click();
    setActionType(constants.product.actionTypes.ADD_IMAGES);
  }

  function handleFileChange(event) {
    const selectedFiles = event.target.files && event.target.files;
    const selectedFile = selectedFiles[0];
    if (!selectedFile) return;

    if (actionType === constants.product.actionTypes.ALTER_IMAGE) {
      //! MODE: CHANGE IMAGE
      const updatedImagesArray = imagesArray.map((file, index) => {
        console.log("indexFile: ", indexFile);
        if (index === indexFile) {
          return selectedFile;
        } else {
          return file;
        }
      });

      const imageObjectURL = URL.createObjectURL(selectedFile);
      setImageMain(imageObjectURL);
      methods.setValue(name, updatedImagesArray);
      //! reset
      // setIndexFile(-1);
      // setActionType(null);
      return;
    } else if (actionType === constants.product.actionTypes.ADD_IMAGES) {
      //! MODE: ADD IMAGES
      const selectedFilesArray = Array.from(selectedFiles);
      const newImagesArray = imagesArray.concat(selectedFilesArray);
      methods.setValue(name, newImagesArray);
      return;
    } else {
      //! MODE: UPLOAD ALL OF IMAGES
      const selectedFilesArray = Array.from(selectedFiles);
      // const imagesArray = selectedFilesArray.map((file) =>
      //   URL.createObjectURL(file)
      // );

      methods.setValue(name, selectedFilesArray);
    }
  }

  const menuItems = [
    {
      key: "menu-item-0",
      label: "Thay đổi",
      actionType: constants.product.actionTypes.ALTER_IMAGE,
    },
    {
      key: "menu-item-1",
      label: "Xóa",
      actionType: constants.product.actionTypes.DELETE_IMAGE,
    },
  ];

  return (
    <Form.Group
      as={Row}
      className={`form-image ${className}`}
      controlId={`ipt-${name}`}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <div className="">
        {
          //! Main Image
        }
        <div className="image-main">
          <div className="image-header">
            <MenuButtonComponent
              menuItems={menuItems}
              handleClickActionTypeSubmit={(actionType) =>
                handleActionType(actionType, indexFile)
              }
            />
          </div>

          <div className="image-body">
            <img src={imageMain || imagesArray[indexFile]} alt="" />
          </div>
        </div>
        {
          //! Images Slice
        }
        <div className="image-slides">
          {imagesArray.length > 0 &&
            imagesArray.map((image, index) => {
              return (
                <ImageSliceComponent
                  key={index}
                  image={image}
                  onClick={() => handleImageSliceClick(index)}
                />
              );
            })}
          <div className="image-slide btn-add" onClick={handleAddImage}>
            <span>Thêm</span>
          </div>
        </div>
      </div>
      <Col>
        <Form.Control
          isInvalid={methods.formState.errors[name] ? true : false}
          size="sm"
          accept="image/png, image/jpg, image/jpeg"
          {...methods.register(name)}
          {...rest}
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
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

//! Image Slice Presentation Component
const ImageSliceComponent = (props) => {
  let imageUrl;
  if (props.image.type?.includes("image/")) {
    imageUrl = URL.createObjectURL(props.image);
  } else {
    imageUrl = props.image;
  }

  return (
    <div className="image-slide" {...props}>
      <div className="image-body">
        <img src={imageUrl} alt={imageUrl} />
      </div>
    </div>
  );
};

export default ImageComponent;
