import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { searchCategory } from '../../../Search/SearchSlice';

const ToolbarSearchComponent = ({ search, setSearch }) => {
  
  const handleChange = (e) => {
    setSearch((prevState) => ({ ...prevState, keyword: e.target.value }));
  };

  return (
    <Form.Control
      className="form-control me-1"
      type="search"
      placeholder="Tìm kiếm username, họ và tên, số điện thoại..."
      aria-label="Search"
      onChange={handleChange}
      value={search.keyword}
    />
  );
};

export default ToolbarSearchComponent;
