import React from "react";
import { Row, Col } from "react-bootstrap";
//! imp Comps
import ProductCard from "../../../features/Product/components/Card/ProductCard";

const ShopComponent = ({ products }) => {
  return (
    <Row>
      {products?.length > 0 &&
        products.map((product) => {
          return (
            <Col key={product._id} xs={6} md={4} lg={3}>
              {/* <LoadingProductCard /> */}
              <ProductCard product={product} />
            </Col>
          );
        })}
    </Row>
  );
};

export default ShopComponent;
