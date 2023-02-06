import React from 'react';

const LocalSearchComponent = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <input
      type="search"
      placeholder="Điền tên category bạn muốn tìm"
      value={keyword}
      onChange={handleSearchChange}
      aria-label="Search"
      className="form-control me-2"
    />
  );
};

export default LocalSearchComponent;
