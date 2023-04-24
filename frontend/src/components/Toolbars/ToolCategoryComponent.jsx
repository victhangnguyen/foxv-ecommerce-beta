import React from 'react';
import { Form } from 'react-bootstrap';

const ToolCategoryComponent = ({ label, categories, handleCategoryChange }) => {
  const renderCategories = categories?.map((category) => (
    <option key={category._id} value={category._id}>{category.name}</option>
  ));

  return (
    <div className="filter-price">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Select
        onChange={handleCategoryChange}
        aria-label="Chọn giá của sản phẩm"
      >
        <option value={''}>Tất cả sản phẩm</option>
        {renderCategories}
      </Form.Select>
    </div>
  );
};

export default ToolCategoryComponent;
