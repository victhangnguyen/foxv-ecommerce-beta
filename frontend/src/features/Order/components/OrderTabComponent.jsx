import React from 'react';
import { Form, Button, FormCheck } from 'react-bootstrap';
//! imp Comps
import OrderItemComponent from './OrderItemComponent';

const OrderTabComponent = ({
  orders,
  search,
  setSearch,
  selectedIds,
  isCheckAll,
  handleCheckChange,
  handleCheckAllChange,
}) => {
  //! localState: keyword
  const [keyword, setKeyword] = React.useState('');

  function handleChangeKeyword(e) {
    // setSearch((prevState) => ({ ...prevState, keyword: e.target.value }));
    setKeyword(e.target.value);
  }

  function handleSearch(e) {
    e.preventDefault();
    // setSearch((prevState) => ({ ...prevState, keyword: keyword }));
    setSearch((prevState) => ({ ...prevState, keyword: keyword }));
  }

  const renderOrderItems = orders?.map((order) => {
    return (
      <OrderItemComponent
        key={order._id}
        order={order}
        selectedIds={selectedIds}
        handleCheckChange={handleCheckChange}
      />
    );
  });

  return (
    <div className="container">
      <div className="d-flex">
        <Form.Control
          type="search"
          placeholder="Tìm kiếm theo Id, họ và tên, địa chỉ giao hàng..."
          className="me-2"
          aria-label="Search"
          onChange={handleChangeKeyword}
        />
        <Button variant="outline-success" onClick={handleSearch}>
          Tìm
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table__orders">
          <thead>
            <tr>
              <th scope="col" className="col py-1 px-3">
                <FormCheck
                  inline
                  checked={isCheckAll}
                  onChange={handleCheckAllChange}
                />
              </th>
              <th scope="col" className="col-3 py-1 px-3 text-center">
                Id
              </th>
              <th scope="col" className="col-3 py-1 px-3 text-center">
                Name
              </th>
              <th scope="col" className="col-4 py-1 px-3 text-center">
                Address
              </th>
              <th scope="col" className="col-2 py-1 px-3 text-center">
                Status
              </th>
              <th scope="col" className="col"></th>
            </tr>
          </thead>
          <tbody>{renderOrderItems}</tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTabComponent;
