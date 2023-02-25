import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
//! imp Actions
import { fetchProductsByFilter } from '../../product/productSlice';
import { clearSearchQuery } from '../../search/searchSlice';

const SearchFiltersComponent = () => {
  const dispatch = useDispatch();

  const handlePrice = (e) => {
    if (!e.target.value) return;
    dispatch(clearSearchQuery());
    dispatch(fetchProductsByFilter({ priceIndex: e.target.value }));
  };

  return (
    <div className="container-search-filters">
      <h4>Search/Filters</h4>
      <Form>
        <div className="filter-price">
          <Form.Label>Theo giá:</Form.Label>
          <Form.Select
            onChange={handlePrice}
            aria-label="Chọn giá của sản phẩm"
          >
            <option value={0}>Tất cả sản phẩm</option>
            <option value={1}>100.000 - 200.000</option>
            <option value={2}>200.000 - 400.000</option>
            <option value={3}>400.000 - 700.000</option>
            <option value={4}>700.000 - 1000.000</option>
          </Form.Select>
        </div>
      </Form>
    </div>
  );
};

export default SearchFiltersComponent;
