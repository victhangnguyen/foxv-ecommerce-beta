import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

//! imp Icons
import SearchIcon from '../../../components/Icons/SearchIcon';

//! imp Actions
import { searchQuery } from '../SearchSlice';

const SearchComponent = () => {
  const dispatch = useDispatch();
  const { text } = useSelector((state) => state.search);

  const handleChange = (e) => {
    e.preventDefault();
    const delayed = setTimeout(() => {
      dispatch(dispatch(searchQuery(e.target.value)));
    }, 300);
    return () => clearTimeout(delayed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form className="d-flex" onSubmit={handleSubmit}>
      <Form.Control
        className="form-control me-1"
        type="search"
        placeholder="Search"
        aria-label="Search"
        onChange={handleChange}
        defaultValue={text}
      />
      <Button variant="light">
        <SearchIcon />
      </Button>
    </Form>
  );
};

export default SearchComponent;
