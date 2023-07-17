import React from 'react';
import { Form } from 'react-bootstrap';

const ToolSortOrderComponent = ({handleSortOrderChange}) => {
  return (
    <div className="tool-sort">
      <Form.Select
        onChange={handleSortOrderChange}
        aria-label="Chọn giá của sản phẩm"
      >
        <option value={'createdAt-desc'}>Xếp theo Sản phẩm mới</option>
        <option value={'createdAt-asc'}>Xếp theo Sản phẩm cũ</option>
        <option value={'slug-asc'}>Xếp theo Tên tăng dần</option>
        <option value={'slug-desc'}>Xếp theo Tên giảm dần</option>
        <option value={'price-asc'}>Xếp theo Giá tăng dần</option>
        <option value={'price-desc'}>Xếp theo Giá giảm dần</option>
      </Form.Select>
    </div>
  );
};

export default ToolSortOrderComponent;
