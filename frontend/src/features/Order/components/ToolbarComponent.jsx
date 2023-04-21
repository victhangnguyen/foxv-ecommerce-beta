import React from 'react';
import _ from 'lodash';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//! imp Constants
import constants from '../../../constants';

const ToolbarComponent = ({
  isCheckAll,
  selectedIds,
  keyword,
  setKeyword,
  setSearch,
  handleCheckAllChange,
  handleOpenModal,
  ...rest
}) => {
  function handleChangeSearch(e) {
    setKeyword(e.target.value);
  }

  function handleClickSearch() {
    setSearch((prevState) => ({ ...prevState, keyword: keyword }));
  }

  function handleKeyDownSearch(event) {
    if (event.key === 'Enter') {
      handleClickSearch();
    }
  }

  return (
    <Row className="btn-toolbar" {...rest}>
      <Col xs={12} md={3}>
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
                      constants.order.actionTypes.DELETE_ORDERS,
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
      <Col xs={12} md={9} className="d-flex">
        <Form.Control
          className="form-control me-1"
          type="search"
          placeholder="Tìm theo Họ và tên, Địa chỉ, Tình trạng..."
          aria-label="Search"
          onChange={handleChangeSearch}
          value={keyword}
          onKeyDown={handleKeyDownSearch}
        />
        <Button variant="light" onClick={handleClickSearch}>
          <FontAwesomeIcon
            color="black"
            size="lg"
            icon="fa-solid fa-magnifying-glass"
          />
        </Button>
      </Col>
    </Row>
  );
};

export default ToolbarComponent;
