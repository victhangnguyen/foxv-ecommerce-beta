import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//! imp components
// import RatingComponent from '../../../../components/RatingComponent';

const LoadingProductCard = ({ count }) => {
  const cards = () => {
    let totalCards = [];
    for (let i = 0; i < count; i++) {
      totalCards.push(
        <Col key={i} xs={6} md={4} lg={3}>
          <Card
            as="article"
            className="my-3 p-3 rounded card-product"
            aria-hidden="true"
          >
            <Card.Body>
              <div className="loader-container">
                <div className="lds-roller">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <Link to={'...'}>
                <Card.Title as={'div'} className="placeholder-glow">
                  <span className="placeholder col-6"></span>
                </Card.Title>
              </Link>
              <Card.Text as={'div'}>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-7"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-6"></span>
                  <span className="placeholder col-8"></span>
                </p>
              </Card.Text>
              <Card.Text as={'h5'}></Card.Text>
            </Card.Body>
            <Card.Footer as={'div'} className="d-flex">
              <Button
                className="disabled placeholder"
                size="sm"
                variant={'primary'}
              >
                Mua ngay
              </Button>
              <Button
                className="disabled placeholder"
                size="sm"
                variant={'secondary'}
              >
                Thêm vào Giỏ
              </Button>
            </Card.Footer>{' '}
          </Card>
        </Col>
      );
    }

    return totalCards;
  };

  return <Row>{cards()}</Row>;
};

export default LoadingProductCard;
