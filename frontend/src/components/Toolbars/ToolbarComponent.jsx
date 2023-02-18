import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

//! imp Services
import productService from '../../features/Product/services/productService';

//! imp Components
import SearchComponent from '../../features/Search/components/SearchComponent';

const ToolbarComponent = ({
  isCheckAll,
  checkProductIds,
  handleCheckChange,
  handleDelete,
  ...rest
}) => {
  const [searchType, setSearchType] = React.useState('query');

  const etargetvalueCountRef = React.useRef(0);
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  return (
    <div className="btn-toolbar" {...rest}>
      <Row className="w-100">
        <Col lg={5}>
          <div className="btn-toolbar__group">
            <div className="tn-bgroup-left">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="chkSelectAll"
                  checked={isCheckAll}
                  onChange={handleCheckChange}
                />
                <label className="form-check-label" htmlFor="chkSelectAll">
                  {isCheckAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả  '}
                </label>
              </div>
            </div>
            {checkProductIds.length ? (
              <div className="btn-group-right">
                <div
                  className="btn-group me-2"
                  role="group"
                  aria-label="Clipboard group"
                >
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </Col>

        <Col xs={4} lg={{ span: 2, offset: 1 }}>
          <div className="">
            <Form.Select
              id="slt-search-type"
              onChange={handleSearchTypeChange}
              value={searchType}
            >
              <option value="query">Tìm kiếm theo Text</option>
              <option value="price">Tìm kiếm theo Giá</option>
              <option value="category">Tìm kiếm theo Category</option>
              <option value="sub-category">Tìm kiếm theo SubCategory</option>
            </Form.Select>
          </div>
        </Col>
        <Col xs={8} lg={4}>
          {searchType === 'query' && <SearchComponent />}
          {searchType === 'price' && 'Price'}
          {searchType === 'cateogory' && 'Category'}
          {searchType === 'sub-category' && 'Sub-Category'}
        </Col>
      </Row>
    </div>
  );
};

export default ToolbarComponent;
