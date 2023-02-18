import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

//! imp Icons
import SearchIcon from '../../../components/Icons/SearchIcon';

//! imp Actions
import { searchQuery } from '../SearchSlice';

const SearchComponent = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    //! value: e.target.value
    dispatch(searchQuery(e.target.value));
  };

  return (
    <Form className="d-flex">
      <Form.Control
        className="form-control me-1"
        type="search"
        placeholder="Search"
        aria-label="Search"
        onChange={handleChange}
      />
      <Button variant="light">
        <SearchIcon />
      </Button>
    </Form>
  );
};

export default SearchComponent;
