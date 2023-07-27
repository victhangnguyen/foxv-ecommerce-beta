import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import * as yup from "yup";

//! imp Actions
// import { fetchProductsByFilter } from '../../product/productSlice';
// import { clearSearchQuery } from '../../search/searchSlice';
import { emptyCategory, setErrorMessage } from "../../Category/CategorySlice";
//! imp Comps
import FormComponent from "../../../components/Form/FormComponent";
import FormSelectComponent from "../../../components/Form/FormSelectComponent";
import InputComponent from "../../../components/Form/InputComponent";
//! imp Constants
import constants from "../../../constants";
import API from "../../../API";

const SearchFiltersComponent = ({ handleSubmitSearch }) => {
  const [categories, setCategories] = React.useState([]);

  const validationSchema = yup.object({
    keyword: yup.string(),
    price: yup.string(),
    category: yup.string(),
  });

  React.useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await API.category.getCategories();
      setCategories(response?.data?.categories);
    } catch (error) {
      setCategories(
        error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error
      );
    }
  }

  const categoryOpts = [
    {
      key: 0,
      value: "",
      label: "Tất cả Loại sản phẩm",
    },
  ];

  categories?.forEach((category, index) => {
    categoryOpts.push({
      key: index + 1,
      value: category._id,
      label: category.name,
    });
  });

  const priceOtps = [
    {
      key: 0,
      value: constants.toolbar.price.PRICE_RANGE_00,
      label: "Tất cả Giá sản phẩm",
    },
    {
      key: 1,
      value: constants.toolbar.price.PRICE_RANGE_01,
      label: "100.000 - 200.000",
    },
    {
      key: 2,
      value: constants.toolbar.price.PRICE_RANGE_02,
      label: "200.000 - 400.000",
    },
    {
      key: 3,
      value: constants.toolbar.price.PRICE_RANGE_03,
      label: "400.000 - 700.000",
    },
    {
      key: 4,
      value: constants.toolbar.price.PRICE_RANGE_04,
      label: "700.000 - 1000.000",
    },
  ];

  return (
    <div className="toolbar">
      <div className="search-filters ">
        <FormComponent
          validationSchema={validationSchema}
          onSubmit={handleSubmitSearch}
        >
          <InputComponent
            className={"mb-3"}
            name={"keyword"}
            label={"Tìm theo từ khóa"}
          />
          <FormSelectComponent
            className={"mb-3"}
            name={"price"}
            label={"Lọc sản phẩm theo Giá"}
            options={priceOtps}
          />
          <FormSelectComponent
            className={"mb-3"}
            name={"category"}
            label={"Lọc sản phẩm theo Loại"}
            options={categoryOpts}
          />
          <Button className="btn-submit" variant="success" type="submit">
            Tìm sản phẩm
          </Button>
        </FormComponent>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
