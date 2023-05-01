import React from 'react';
import { Form } from 'react-bootstrap';

const ToolPriceComponent = ({ label, handlePriceChange }) => {
  return (
    <div className="filter-price">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Select
        onChange={handlePriceChange}
        aria-label="Chọn giá của sản phẩm"
      >
        <option value={''}>Tất cả sản phẩm</option>
        <option value={'100000-300000'}>100.000 - 300.000</option>
        <option value={'300000-600000'}>300.000 - 600.000</option>
        <option value={'600000-800000'}>600.000 - 800.000</option>
        <option value={'800000-1000000'}>800.000 - 1000.000</option>
      </Form.Select>
    </div>
  );
};

export default ToolPriceComponent;
