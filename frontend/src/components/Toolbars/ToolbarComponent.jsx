import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

//! imp Services
import API from '../../API';

//! imp Actions
import { getProductsByFilters } from '../../features/Product/ProductSlice';
import {
  clearSearch,
  searchCategory,
  searchPrice,
  searchSubCategory,
} from '../../features/Search/SearchSlice';

//! imp Components
import SearchComponent from '../../features/Search/components/SearchComponent';
import ToolSortOrderComponent from './ToolSortOrderComponent';
import ToolPriceComponent from './ToolPriceComponent';
import ToolCategoryComponent from './ToolCategoryComponent';

const ToolbarComponent = ({
  setSort,
  setOrder,
  isCheckAll,
  checkedProductIds,
  handleCheckChange,
  handleShowDeleteModal,
  currentPage,
  ...rest
}) => {
  const dispatch = useDispatch();
  const [searchType, setSearchType] = React.useState('text');
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await API.category.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const handleSearchTypeChange = (e) => {
    dispatch(clearSearch());
    setSearchType(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    const sort = e.target.value.split('-')[0];
    const order = e.target.value.split('-')[1];
    setSort(sort);
    setOrder(order);
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    dispatch(searchPrice(price));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    dispatch(searchCategory(categoryId));
  };

  return (
    <Row className="btn-toolbar" {...rest}>
      <Col xs={12} lg={3}>
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
          {checkedProductIds.length ? (
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
                    handleShowDeleteModal('multiple', checkedProductIds)
                  }
                >
                  Xóa
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Col>
      <Col xs={{ span: 4, offset: 0 }} lg={{ span: 2, offset: 1 }}>
        <div className="">
          <Form.Select
            id="slt-search-type"
            onChange={handleSearchTypeChange}
            value={searchType}
          >
            <option value="text">Tìm kiếm Text</option>
            <option value="price">Tìm kiếm Giá</option>
            <option value="category">Tìm kiếm Loại (Category)</option>
          </Form.Select>
        </div>
      </Col>
      <Col xs={4} lg={4}>
        {searchType === 'text' && <SearchComponent />}
        {searchType === 'price' && (
          <ToolPriceComponent handlePriceChange={handlePriceChange} />
        )}
        {searchType === 'category' && (
          <ToolCategoryComponent
            categories={categories}
            handleCategoryChange={handleCategoryChange}
          />
        )}
      </Col>
      <Col xs={4} lg={2}>
        <ToolSortOrderComponent handleSortOrderChange={handleSortOrderChange} />
      </Col>
    </Row>
  );
};

export default ToolbarComponent;
