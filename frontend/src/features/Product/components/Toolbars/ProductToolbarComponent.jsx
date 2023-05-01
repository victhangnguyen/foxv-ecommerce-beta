import _ from 'lodash';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//! imp Components
import { Row, Col, Form, Button } from 'react-bootstrap';
import FormComponent from '../../../../components/Form/FormComponent';
import InputComponent from '../../../../components/Form/InputComponent';
import SelectComponent from '../../../../components/Form/SelectComponent';
import SelectControllerComponent from '../../../../components/Form/SelectControllerComponent';

//! imp Comps/Toolbar
import ToolSortOrderComponent from './ToolSortOrderComponent';
import ToolPriceComponent from './ToolPriceComponent';
import ToolCategoryComponent from './ToolCategoryComponent';

//! imp APIs
import API from '../../../../API';

//! imp Constants
import constants from '../../../../constants';

const ProductToolbarComponent = ({
  seFilterOpts,
  isCheckAll,
  selectedIds,
  handleCheckAllChange,
  handleOpenModal,
  rest,
}) => {
  //! localState: init
  const [categories, setCategories] = React.useState([]);
  //! localState: search
  const [keyword, setKeyword] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [price, setPrice] = React.useState('');

  React.useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const response = await API.category.getCategories();
    setCategories(response.data.categories);
  }

  //! opts: price
  const priceOpts = [
    { key: 'price-0', value: '', label: 'Chọn giá sản phẩm' },
    { key: 'price-1', value: '100000-300000', label: '100.000 - 300.000' },
    { key: 'price-2', value: '300000-600000', label: '300.000 - 600.000' },
    { key: 'price-3', value: '600000-800000', label: '600.000 - 800.000' },
    { key: 'price-4', value: '800000-1000000', label: '800.000 - 1000.000' },
  ];

  //! opts: category
  const renderCategories = categories?.map((category) => (
    <option key={category._id} value={category._id}>
      {category.name}
    </option>
  ));

  function handleChangeKeyword(e) {
    setKeyword(e.target.value);
  }

  function handleChangePrice(e) {
    setPrice(e.target.value);
  }

  function handleChangeCategory(e) {
    setCategory(e.target.value);
  }

  function handleClickSearch() {
    seFilterOpts((prevState) => ({ ...prevState, price, category, keyword }));
  }

  function handleClickClearSearch() {
    setKeyword('');
    setPrice('');
    setCategory('');

    seFilterOpts((prevState) => ({
      ...prevState,
      price: '',
      category: '',
      keyword: '',
    }));
  }

  function handleKeyDownSearch(event) {
    if (event.key === 'Enter') {
      handleClickSearch();
    }
  }


  return (
    <Row className="btn-toolbar" {...rest}>
      <Col xs={12} lg={3} className="mb-2">
        <div className="btn-toolbar__group">
          <div className="tn-bgroup-left">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="chkSelectAll"
                checked={isCheckAll}
                onChange={handleCheckAllChange}
              />
              <label className="form-check-label" htmlFor="chkSelectAll">
                {isCheckAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả  '}
              </label>
            </div>
          </div>
          {selectedIds?.length ? (
            <div className="btn-group-right">
              <div
                className="btn-group me-2"
                role="group"
                aria-label="Clipboard group"
              >
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    handleOpenModal(
                      constants.product.actionTypes.DELETE_MANY_PRODUCTS,
                      selectedIds
                    )
                  }
                >
                  Xóa
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Col>
      <Col xs={12} lg={{ span: 8, offset: 1 }}>
        <Row className="mb-2">
          <Col xs={10}>
            <Form.Control
              type="text"
              value={keyword}
              onChange={handleChangeKeyword}
              onKeyDown={handleKeyDownSearch}
            />
          </Col>
          <Col xs={2}>
            <Button
              className="w-100"
              variant="light"
              onClick={handleClickSearch}
            >
              <FontAwesomeIcon
                color="black"
                size="lg"
                icon="fa-solid fa-magnifying-glass"
              />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <Form.Select
              onChange={handleChangePrice}
              value={price}
              aria-label="Chọn giá của sản phẩm"
            >
              {priceOpts.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={5}>
            <Form.Select
              onChange={handleChangeCategory}
              value={category}
              aria-label="Chọn giá Loại sản phẩm"
            >
              <option value="">Chọn loại sản phẩm</option>
              {renderCategories}
            </Form.Select>
          </Col>
          <Col xs={2}>
            <Button
              className="w-100"
              variant="light"
              onClick={handleClickClearSearch}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ProductToolbarComponent;
